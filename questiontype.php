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
 * Question type class for the ShortMath question type.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>,Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/type/shortanswer/questiontype.php');

/**
 * The ShortMath question type class.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath extends qtype_shortanswer {

    /**
     * extra_question_fields function
     * @return array
     */
    public function extra_question_fields() {
        return ['qtype_shortmath_options', 'usecase', 'editorconfig'];
    }

    public function save_question_options($question) {
        global $DB;

        if (is_numeric($question->editorconfig)) {
            $templateid = $question->editorconfig;
            $originalconfig = $question->originalconfig;
            if ($templateid !== '-1') {
                $template = $DB->get_record('qtype_shortmath_templates', array('id' => $templateid));
                $question->editorconfig = $template->template;
            } else {
                $question->editorconfig = $originalconfig;
            }
        }

        parent::save_question_options($question);

        return true;
    }

}


