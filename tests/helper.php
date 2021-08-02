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
 * Test helpers for the ShortMath question type.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Test helper class for the ShortMath question type.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_test_helper extends question_test_helper {

    /**
     * Function qtype_shortmath_test_helper::get_test_questions
     * @return array
     */
    public function get_test_questions() {
        return array(
            'integration',
            'integration_exact',
            'escapedwildcards'
        );
    }

    /**
     * Makes a ShortMath question with correct answer
     * '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', partially
     * correct answer '0.597' and defaultmark 1. This question also has a
     * '*' match anything answer.
     * @return qtype_shortmath_question
     */
    public function make_shortmath_question_integration() {
        question_bank::load_question_definition_classes('shortmath');
        $q = new qtype_shortmath_question();
        test_question_maker::initialise_a_question($q);
        $q->name = 'Integration';
        $q->questiontext = 'Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)';
        $q->generalfeedback = 'Generalfeedback: \frac{1}{2}\left(\cos(1)-\cos(4)\right) or 0.597 would have been OK.';
        $q->usecase = false;
        $q->answers = array(
            13 => new question_answer(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)',
                1.0, '\frac{1}{2}\left(\cos(1)-\cos(4)\right) is a very good answer.', FORMAT_HTML),
            14 => new question_answer(14, '0.597',
                0.8, 'Answer in three decimals is an OK approximation.', FORMAT_HTML),
            15 => new question_answer(15, '*',
                0.0, 'That is a bad answer.', FORMAT_HTML),
        );
        $q->qtype = question_bank::get_qtype('shortmath');

        return $q;
    }

    /**
     * Gets the question data for a shortmath question with with correct
     * ansewer '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', partially
     * correct answer '0.597' and defaultmark 1.
     * This question also has a '*' match anything answer.
     * @return stdClass
     */
    public function get_shortmath_question_data_integration() {
        $qdata = new stdClass();
        test_question_maker::initialise_question_data($qdata);

        $qdata->qtype = 'shortmath';
        $qdata->name = 'Integration';
        $qdata->questiontext = 'Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)';
        $qdata->generalfeedback = 'Generalfeedback: \frac{1}{2}\left(\cos(1)-\cos(4)\right) or 0.597 would have been OK.';

        $qdata->options = new stdClass();
        $qdata->options->usecase = 0;
        $qdata->options->answers = array(
            13 => new question_answer(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)',
                1.0, '\frac{1}{2}\left(\cos(1)-\cos(4)\right) is a very good answer.', FORMAT_HTML),
            14 => new question_answer(14, '0.597',
                0.8, 'Answer in three decimals is an OK approximation.', FORMAT_HTML),
            15 => new question_answer(15, '*',
                0.0, 'That is a bad answer.', FORMAT_HTML),
        );

        return $qdata;
    }

    /**
     * Gets the question form data for a shortmath question with with correct
     * answer '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', partially
     * correct answer '0.597' and defaultmark 1.
     * This question also has a '*' match anything answer.
     * @return stdClass
     */
    public function get_shortmath_question_form_data_integration() {
        $form = new stdClass();

        $form->name = 'Integration';
        $form->questiontext = array('text' => 'Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)',
            'format' => FORMAT_HTML);
        $form->defaultmark = 1.0;
        $form->generalfeedback = array(
            'text' => 'Generalfeedback: \frac{1}{2}\left(\cos(1)-\cos(4)\right) or 0.597 would have been OK.',
            'format' => FORMAT_HTML);
        $form->usecase = false;
        $form->answer = array('integration', 'integration_exact', '*');
        $form->fraction = array('1.0', '0.8', '0.0');
        $form->feedback = array(
            array('text' => '\frac{1}{2}\left(\cos(1)-\cos(4)\right) is a very good answer.', 'format' => FORMAT_HTML),
            array('text' => 'Answer in three decimals is an OK approximation.', 'format' => FORMAT_HTML),
            array('text' => 'That is a bad answer.', 'format' => FORMAT_HTML),
        );

        return $form;
    }

    /**
     * Makes a shortmath question with just the correct answer
     * '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', and
     * no other answer matching.
     * @return qtype_shortmath_question
     */
    public function make_shortmath_question_integration_exact() {
        question_bank::load_question_definition_classes('shortmath');
        $q = new qtype_shortmath_question();
        test_question_maker::initialise_a_question($q);
        $q->name = 'Integration exact';
        $q->questiontext = 'Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)';
        $q->generalfeedback = 'Generalfeedback: You should have said \frac{1}{2}\left(\cos(1)-\cos(4)\right).';
        $q->usecase = false;
        $q->answers = array(
            13 => new question_answer(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)',
                1.0, '\frac{1}{2}\left(\cos(1)-\cos(4)\right) is correct.', FORMAT_HTML),
        );
        $q->qtype = question_bank::get_qtype('shortmath');

        return $q;
    }

    /**
     * Gets the question data for a shortmath question
     * with just the correct answer
     * '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', and
     * no other answer matching.
     * @return stdClass
     */
    public function get_shortmath_question_data_integration_exact() {
        $qdata = new stdClass();
        test_question_maker::initialise_question_data($qdata);

        $qdata->qtype = 'shortmath';
        $qdata->name = 'Integration exact';
        $qdata->questiontext = 'Evaluate the integral \( \int _1^2x\sin \left(x^2\right)dx \)';
        $qdata->generalfeedback = 'Generalfeedback: You should have said \frac{1}{2}\left(\cos(1)-\cos(4)\right).';

        $qdata->options = new stdClass();
        $qdata->options->usecase = false;
        $qdata->options->answers = array(
            13 => new question_answer(13, '\frac{1}{2}\left(\cos(1)-\cos(4)\right)',
                1.0, '\frac{1}{2}\left(\cos(1)-\cos(4)\right) is correct.', FORMAT_HTML),
        );

        return $qdata;
    }

    /**
     * Makes a shortmath question with just the correct answer
     * '\frac{1}{2}\left(\cos(1)-\cos(4)\right)', and
     * no other answer matching.
     * @return qtype_shortmath_question
     */
    public function make_shortmath_question_escapedwildcards() {
        question_bank::load_question_definition_classes('shortmath');
        $q = new qtype_shortmath_question();
        test_question_maker::initialise_a_question($q);
        $q->name = 'Question with escaped * in the answer.';
        $q->questiontext = 'How to you write x times y in C? __________';
        $q->generalfeedback = 'In C, this expression is written x * y.';
        $q->usecase = false;
        $q->answers = array(
            13 => new question_answer(13, '*x\*y*', 1.0, 'Well done.', FORMAT_HTML),
        );
        $q->qtype = question_bank::get_qtype('shortmath');

        return $q;
    }
}
