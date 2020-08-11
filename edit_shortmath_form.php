<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Defines the editing form for the ShortMath question type.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/type/shortanswer/edit_shortanswer_form.php');

/**
 * ShortMath question editing form definition.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_edit_form extends qtype_shortanswer_edit_form {

    /**
     * Function qtype_shortmath_edit_form::qtype
     * @return string
     */
    public function qtype() {
        return 'shortmath';
    }

    /**
     * Function qtype_shortmath_edit_form::definition_inner
     * @param $mform
     */
    protected function definition_inner($mform) {
        global $DB;

        $menu = array(
            get_string('caseno', 'qtype_shortanswer'),
            get_string('caseyes', 'qtype_shortanswer')
        );
        $mform->addElement('select', 'usecase',
            get_string('casesensitive', 'qtype_shortanswer'), $menu);

        $editorconfig = isset($this->question->options->editorconfig) ?
            $this->question->options->editorconfig : 'none';
        $mform->addElement('hidden', 'originalconfig', $editorconfig);
        $mform->setType('originalconfig', PARAM_RAW);

        $templates = $DB->get_records('qtype_shortmath_templates', null, 'id');
        foreach ($templates as $template) {
            $options[$template->template] = $template->name; // TODO: template value as key is ambiguous.
        }

        $selecttemplate = $mform->addElement('select', 'editorconfig',
            get_string('toolbar_template', 'qtype_shortmath'), $options);

        $defaultid = get_config('qtype_shortmath', 'defaultconfiguration');
        $default = $DB->get_field('qtype_shortmath_templates', 'template', array('id' => $defaultid));

        $selecttemplate->setSelected($default);

        $mform->addElement('advcheckbox', 'configchangeconfirm', '',
            get_string('configchangeconfirm', 'qtype_shortmath'));

        $mform->addElement('static', 'answersinstruct',
            get_string('correctanswers', 'qtype_shortanswer'),
            get_string('filloutoneanswer', 'qtype_shortmath'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_shortanswer', '{no}'),
            question_bank::fraction_options());

        $this->add_interactive_settings();
    }

    /**
     * edit form validdation.
     * @param $data
     * @param $files
     * @return mixed
     */
    public function validation($data, $files) {
        $errors = parent::validation($data, $files);

        $originalconfigvalue = $data['originalconfig'];

        if ($originalconfigvalue !== $data['editorconfig'] && $originalconfigvalue !== 'none'
            && !$data['configchangeconfirm']) {
            $errors['configchangeconfirm'] = get_string('youmustconfirm', 'qtype_shortmath');
        }

        return $errors;
    }
}
