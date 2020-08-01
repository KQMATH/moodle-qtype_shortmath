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

    public function qtype() {
        return 'shortmath';
    }

    protected function definition_inner($mform) {
        global $DB;

        $menu = array(
            get_string('caseno', 'qtype_shortanswer'),
            get_string('caseyes', 'qtype_shortanswer')
        );
        $mform->addElement('select', 'usecase',
            get_string('casesensitive', 'qtype_shortanswer'), $menu);

        $templates = $DB->get_records('qtype_shortmath_templates', null, 'id');
        foreach ($templates as $template) {
            $options[$template->template] = $template->name; // TODO: template value as key is ambiguous
        }
        $mform->addElement('select', 'editorconfig',
            get_string('toolbar_template', 'qtype_shortmath'), $options);

        $mform->addElement('static', 'answersinstruct',
            get_string('correctanswers', 'qtype_shortanswer'),
            get_string('filloutoneanswer', 'qtype_shortmath'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_shortanswer', '{no}'),
            question_bank::fraction_options());

        $this->add_interactive_settings();
    }
}
