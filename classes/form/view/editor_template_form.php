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
 * Question form
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2021 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath\form\view;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/formslib.php');
require_once($CFG->libdir . '/questionlib.php');

/**
 * Question form
 *
 * @package    qtype_shortmath
 * @copyright  2020 André Storhaug
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_template_form extends \moodleform {

    /**
     * question_details_form constructor.
     * @param \stdClass $question The question to be formed
     * @param \moodle_url $url Questions moodle url
     */
    public function __construct($url) {
        parent::__construct($url);
    }

    /**
     * Defines form
     */
    public function definition() {
        $mform = $this->_form;
        $mform->addElement('header', 'templatemeta', get_string("general", 'form'));

        $mform->addElement('hidden', 'templateid');
        $mform->setType('templateid', PARAM_INT);

        $mform->addElement('text', 'templatename', get_string('templatename', 'qtype_shortmath'));
        $mform->addRule('templatename', get_string('required'), 'required', null, 'client');
        $mform->addHelpButton('templatename', 'templatename', 'qtype_shortmath');
        $mform->setType('templatename', PARAM_RAW);

        $mform->addElement('text', 'templatedescription', get_string('templatedescription', 'qtype_shortmath'));
        $mform->addHelpButton('templatedescription', 'templatedescription', 'qtype_shortmath');
        $mform->setType('templatedescription', PARAM_RAW);

        $mform->addElement('header', 'templateheader', get_string("template", 'qtype_shortmath'));

        $group = [
            $mform->createElement('static', 'mqbtntextlabel', '', '<div class="edit-form mx-2">'),
            $mform->createElement('static', 'mqbtntextlabel', '', get_string('button', 'qtype_shortmath')),
            $mform->createElement('hidden', 'mqbtntext'),
            $mform->createElement('static', 'mqbtntextlabel', '', '</div>'),
            $mform->createElement('static', 'mqbtntextlabel', '', '<div class="edit-form mx-2">'),
            $mform->createElement('static', 'mqexpressionlabel', '', get_string('templatevalue', 'qtype_shortmath')),
            $mform->createElement('hidden', 'mqexpression'),
            $mform->createElement('static', 'mqbtntextlabel', '', '</div>'),
            $mform->createElement('button', 'mqaddbutton', get_string('addbtn', 'qtype_shortmath'), array('class' => 'ml-3'))
        ];

        $mform->addElement('group', 'mqbuttongroup', get_string('createbutton', 'qtype_shortmath'), $group, '', false);
        $mform->addHelpButton('mqbuttongroup', 'mqbuttongroup', 'qtype_shortmath');
        $mform->setType('mqbtntext', PARAM_INT);
        $mform->setType('mqexpression', PARAM_RAW);

        $delete_btn = '
            <div class="delete-box d-none">
                <div class="delete-icon bg-danger text-white">
                    <i class="fa fa-trash-o fa-2x"></i>
                </div>
            </div>
        ';
        $controlsgroup = [
            $mform->createElement('html', \html_writer::start_tag('div', array('class' => 'controlswrapper visual-math-input-wrapper'))),
            $mform->createElement('html', \html_writer::end_tag('div')),
            $mform->createElement('html', $delete_btn),

        ];
        $mform->addElement('group', 'mqcontrolsgroup', get_string('templatepreview', 'qtype_shortmath'), $controlsgroup, '', false);
        $mform->addHelpButton('mqcontrolsgroup', 'mqcontrolsgroup', 'qtype_shortmath');

        $mform->addElement('hidden', 'templatestring');
        $mform->setType('templatestring', PARAM_RAW);

        $group = [
            $mform->createElement('hidden', 'mqtest'),
        ];
        $mform->addElement('group', 'mqpreviewgroup', get_string('testinput', 'qtype_shortmath'), $group, '', false);
        $mform->addHelpButton('mqpreviewgroup', 'templatepreview', 'qtype_shortmath');
        $mform->setType('mqtest', PARAM_RAW);

        $this->add_action_buttons();
    }

    function validation($data, $files) {
        global $DB;
        $errors = parent::validation($data, $files);

        $templateid = $data['templateid'];
        if ($templateid > 0) {
            $template = $DB->record_exists('qtype_shortmath_templates', array('id' => $templateid));
            if (!$template) {
                $errors['templateid'] = get_string('errornonexistingtemplate', 'qtype_shortmath');
            }
        }
        return $errors;
    }
}
