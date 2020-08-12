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
 * ShortMath question renderer class.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/type/shortanswer/renderer.php');

/**
 * Generates the output for ShortMath questions.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_renderer extends qtype_shortanswer_renderer {

    /**
     * fomulation_and_controls function
     * @param question_attempt $qa
     * @param question_display_options $options
     * @return string
     */
    public function formulation_and_controls(question_attempt $qa, question_display_options $options) {
        $result = '';
        $inputname = $qa->get_qt_field_name('answer');
        $questionid = $qa->get_question()->id;

        $result .= html_writer::div('', '', ['class' => 'controls_wrapper']);
        $result .= parent::formulation_and_controls($qa, $options);

        $params = array(
            'inputname' => $inputname,
            'readonly' => false,
            'questionid' => $questionid
        );

        if ($options->readonly) {
            $params['readonly'] = true;
        }

        $this->page->requires->js_call_amd('qtype_shortmath/input', 'initialize', $params);
        return $result;
    }

    /**
     * Return any HTML that needs to be included in the page's <head> when this
     * question is used.
     * @param question_attempt $qa
     * @throws coding_exception
     */
    public function head_code(question_attempt $qa) {
        parent::head_code($qa);

        $this->page->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
        $this->page->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
    }
}
