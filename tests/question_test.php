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
 * Unit tests for the ShortMath question definition class.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/engine/tests/helpers.php');
require_once($CFG->dirroot . '/question/type/shortmath/question.php');


/**
 * Unit tests for the ShortMath question definition class.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_question_test extends advanced_testcase {
    public function test_compare_0_with_wildcard() {
        // Test the classic PHP problem case with '0'.
        $this->assertTrue((bool)qtype_shortmath_question::compare_string_with_wildcard(
                '0', '0', false));
        $this->assertTrue((bool)qtype_shortmath_question::compare_string_with_wildcard(
                '0', '0*', false));
        $this->assertTrue((bool)qtype_shortmath_question::compare_string_with_wildcard(
                '0', '*0', false));
        $this->assertTrue((bool)qtype_shortmath_question::compare_string_with_wildcard(
                '0', '*0*', false));
    }

    public function test_compare_string_with_wildcard_many_stars() {
        // Test the classic PHP problem case with '0'.
        $this->assertTrue((bool)qtype_shortmath_question::compare_string_with_wildcard(
                '<em></em>', '***********************************<em>***********************************</em>', false));
    }

    public function test_is_complete_response() {
        $question = test_question_maker::make_question('shortmath');

        $this->assertFalse($question->is_complete_response(array()));
        $this->assertFalse($question->is_complete_response(array('answer' => '')));
        $this->assertTrue($question->is_complete_response(array('answer' => '0')));
        $this->assertTrue($question->is_complete_response(array('answer' => '0.0')));
        $this->assertTrue($question->is_complete_response(array('answer' => 'x')));
    }

    public function test_is_gradable_response() {
        $question = test_question_maker::make_question('shortmath');

        $this->assertFalse($question->is_gradable_response(array()));
        $this->assertFalse($question->is_gradable_response(array('answer' => '')));
        $this->assertTrue($question->is_gradable_response(array('answer' => '0')));
        $this->assertTrue($question->is_gradable_response(array('answer' => '0.0')));
        $this->assertTrue($question->is_gradable_response(array('answer' => 'x')));
    }

    public function test_grading() {
        $question = test_question_maker::make_question('shortmath');

        $this->assertEquals(array(0, question_state::$gradedwrong),
                $question->grade_response(array('answer' => 'x')));
        $this->assertEquals(array(1, question_state::$gradedright),
                $question->grade_response(array('answer' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right)')));
        $this->assertEquals(array(0.8, question_state::$gradedpartial),
                $question->grade_response(array('answer' => '0.597')));
    }

    public function test_get_correct_response() {
        $question = test_question_maker::make_question('shortmath');

        $this->assertEquals(array('answer' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right)'),
                $question->get_correct_response());
    }

    public function test_get_correct_response_escapedwildcards() {
        $question = test_question_maker::make_question('shortmath', 'escapedwildcards');

        $this->assertEquals(array('answer' => 'x*y'), $question->get_correct_response());
    }

    public function test_get_question_summary() {
        $q = test_question_maker::make_question('shortmath');
        $qsummary = $q->get_question_summary();
        $this->assertEquals('Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)', $qsummary);
    }

    public function test_summarise_response() {
        $q = test_question_maker::make_question('shortmath');
        $summary = $q->summarise_response(array('answer' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right)'));
        $this->assertEquals('\[\frac{1}{2}\left(\cos(1)-\cos(4)\right)\]', $summary);
    }

    public function test_classify_response() {
        $q = test_question_maker::make_question('shortmath');
        $q->start_attempt(new question_attempt_step(), 1);

        $this->assertEquals(array(
                new question_classified_response(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', 1.0)),
                $q->classify_response(array('answer' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right)')));
        $this->assertEquals(array(
                new question_classified_response(14, '0.597', 0.8)),
                $q->classify_response(array('answer' => '0.597')));
        $this->assertEquals(array(
                new question_classified_response(15, '2x', 0.0)),
                $q->classify_response(array('answer' => '2x')));
        $this->assertEquals(array(
                question_classified_response::no_response()),
                $q->classify_response(array('answer' => '')));
    }

    public function test_classify_response_no_star() {
        $q = test_question_maker::make_question('shortmath', 'integration_exact');
        $q->start_attempt(new question_attempt_step(), 1);

        $this->assertEquals(array(
                new question_classified_response(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', 1.0)),
                $q->classify_response(array('answer' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right)')));
        $this->assertEquals(array(
                new question_classified_response(0, '0.597', 0.0)),
                $q->classify_response(array('answer' => '0.597')));
        $this->assertEquals(array(
                question_classified_response::no_response()),
                $q->classify_response(array('answer' => '')));
    }
}
