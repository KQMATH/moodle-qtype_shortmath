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
 * Unit tests for the ShortMath question type class.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/type/shortmath/questiontype.php');
require_once($CFG->dirroot . '/question/engine/tests/helpers.php');
require_once($CFG->dirroot . '/question/type/edit_question_form.php');
require_once($CFG->dirroot . '/question/type/shortmath/edit_shortmath_form.php');

/**
 * Unit tests for the ShortMath question type class.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_test extends advanced_testcase {

    /**
     * Variable qtype_shortmath_test::$includecoverage
     * @var array
     */
    public static $includecoverage = array(
        'question/type/questiontypebase.php',
        'question/type/shortmath/questiontype.php',
    );

    /**
     * Variable qtype_shortmath_test::$qtype
     * @var $qtype
     */
    protected $qtype;

    protected function setUp(): void {
        $this->qtype = new qtype_shortmath();
    }

    protected function tearDown(): void {
        $this->qtype = null;
    }

    /**
     * Function qtype_shortmath_test::get_test_question_data
     * @return mixed
     */
    protected function get_test_question_data() {
        return test_question_maker::get_question_data('shortmath');
    }

    public function test_name() {
        $this->assertEquals($this->qtype->name(), 'shortmath');
    }

    public function test_can_analyse_responses() {
        $this->assertTrue($this->qtype->can_analyse_responses());
    }

    public function test_get_random_guess_score() {
        $q = test_question_maker::get_question_data('shortmath');
        $q->options->answers[15]->fraction = 0.1;
        $this->assertEquals(0.1, $this->qtype->get_random_guess_score($q));
    }

    public function test_get_possible_responses() {
        $q = test_question_maker::get_question_data('shortmath');

        $this->assertEquals(array(
            $q->id => array(
                13 => new question_possible_response('\frac{1}{2}\left(\cos(1)-\cos(4)\right)', 1),
                14 => new question_possible_response('0.597', 0.8),
                15 => new question_possible_response('*', 0),
                null => question_possible_response::no_response()
            ),
        ), $this->qtype->get_possible_responses($q));
    }

    public function test_get_possible_responses_no_star() {
        $q = test_question_maker::get_question_data('shortmath', 'integration_exact');

        $this->assertEquals(array(
            $q->id => array(
                13 => new question_possible_response('\frac{1}{2}\left(\cos(1)-\cos(4)\right)', 1),
                0 => new question_possible_response(get_string('didnotmatchanyanswer', 'question'), 0),
                null => question_possible_response::no_response()
            ),
        ), $this->qtype->get_possible_responses($q));
    }

    public function test_question_saving_integration_exact() {
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $questiondata = test_question_maker::get_question_data('shortmath');
        $formdata = test_question_maker::get_question_form_data('shortmath');

        $generator = $this->getDataGenerator()->get_plugin_generator('core_question');
        $cat = $generator->create_question_category(array());

        $formdata->category = "{$cat->id},{$cat->contextid}";
        qtype_shortmath_edit_form::mock_submit((array)$formdata);

        $form = qtype_shortmath_test_helper::get_question_editing_form($cat, $questiondata);

        $this->assertTrue($form->is_validated());

        $fromform = $form->get_data();

        $returnedfromsave = $this->qtype->save_question($questiondata, $fromform);
        $actualquestionsdata = question_load_questions(array($returnedfromsave->id));
        $actualquestiondata = end($actualquestionsdata);

        foreach ($questiondata as $property => $value) {
            if (!in_array($property, array('id', 'version', 'timemodified', 'timecreated', 'options'))) {
                $this->assertAttributeEquals($value, $property, $actualquestiondata);
            }
        }

        foreach ($questiondata->options as $optionname => $value) {
            if ($optionname != 'answers') {
                $this->assertAttributeEquals($value, $optionname, $actualquestiondata->options);
            }
        }
    }

    public function test_question_saving_trims_answers() {
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $questiondata = test_question_maker::get_question_data('shortmath');
        $formdata = test_question_maker::get_question_form_data('shortmath');

        $generator = $this->getDataGenerator()->get_plugin_generator('core_question');
        $cat = $generator->create_question_category(array());

        $formdata->category = "{$cat->id},{$cat->contextid}";
        $formdata->answer[0] = '   \frac{1}{2}\left(\cos(1)-\cos(4)\right)   ';
        qtype_shortmath_edit_form::mock_submit((array)$formdata);

        $form = qtype_shortmath_test_helper::get_question_editing_form($cat, $questiondata);

        $this->assertTrue($form->is_validated());

        $fromform = $form->get_data();

        $returnedfromsave = $this->qtype->save_question($questiondata, $fromform);
        $actualquestionsdata = question_load_questions(array($returnedfromsave->id));
        $actualquestiondata = end($actualquestionsdata);

        $firstsavedanswer = reset($questiondata->options->answers);
        $this->assertEquals('\frac{1}{2}\left(\cos(1)-\cos(4)\right)', $firstsavedanswer->answer);
    }
}
