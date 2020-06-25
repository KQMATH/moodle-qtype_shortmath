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
 * Main interface to Question Tracker
 *
 * @package     local_questiontracker
 * @author      André Storhaug <andr3.storhaug@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
// File: /mod/mymodulename/view.php
require_once(__DIR__.'/../../../config.php');

$context = context_system::instance();
$PAGE->set_context($context);
$PAGE->set_url('/question/type/shortmath/view_edit.php');
$title = "Editor configuration";
$PAGE->set_title($title);
$PAGE->set_pagelayout('standard');

$PAGE->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
$PAGE->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
$PAGE->requires->css('/question/type/shortmath/editor/editor.css');

echo $OUTPUT->header();
echo $OUTPUT->heading($title);

$test_inputattributes = array(
    'type' => 'text',
    'name' => 'test',
//    'value' => '',
    'id' => 'test',
//    'class' => 'form-control d-inline',
    'size' => 30
);

$test_input = html_writer::empty_tag('input', $test_inputattributes);
$test_span = html_writer::tag('span', $test_input, array('class' => 'answer'));
$test_label = html_writer::tag('label', 'Test:', array('for' => 'test'));

$btn_inputattributes = array('type' => 'text', 'name' => 'btn', 'id' => 'btn', 'size' => 30);
$btn_input = html_writer::empty_tag('input', $btn_inputattributes);
$btn_span = html_writer::tag('span', $btn_input, array('class' => 'answer'));
$btn_label = html_writer::tag('label', 'Button:', array('for' => 'btn'));;

$exp_inputattributes = array('type' => 'text', 'name' => 'exp', 'id' => 'exp', 'size' => 30);
$exp_input = html_writer::empty_tag('input', $exp_inputattributes);
$exp_span = html_writer::tag('span', $exp_input, array('class' => 'answer'));
$exp_label = html_writer::tag('label', 'Expression:', array('for' => 'exp'));

$save_buttonattributes = array('type' => 'button', 'name' => 'save',
    'id' => 'save', 'class' => 'btn btn-primary', 'value' => 'Save');
$save_button = html_writer::empty_tag('input', $save_buttonattributes);

$tr_start = html_writer::start_tag('tr');
$td_start =  html_writer::start_tag('td');
$tr_end =  html_writer::end_tag('tr');
$td_end = html_writer::end_tag('td');

$div_start = html_writer::start_tag('div');
$input_div_start = html_writer::start_tag('div', array('class' => 'ablock form-inline'));
$div_end =  html_writer::end_tag('div');

// render page
//echo html_writer::tag('div', "Edit the file under moodle/question/type/shortmath/amd/src/view-edit.js");

// Controls
$output = html_writer::start_tag('div', array('class' => 'que shortmath'));
$output .= html_writer::tag('div', '', array('class' => 'controls_wrapper'));

// Table
$output .= html_writer::start_tag('table');

// Test
$output .= $tr_start .$td_start .$test_label .$td_end .$td_start .$input_div_start
    .$test_span. $div_end .$td_end .$tr_end;

// Button
$output .= $tr_start .$td_start .$btn_label .$td_end .$td_start .$input_div_start
    .$btn_span .$div_end .$td_end .$tr_end;

// Expression
$output .= $tr_start .$td_start .$exp_label .$td_end .$td_start .$input_div_start
    .$exp_span .$div_end .$td_end .$tr_end;

// Save
$output .= $tr_start .$td_start .$div_start .$save_button .$div_end .$td_end .$tr_end;

$output .= html_writer::end_tag('table') .$div_end;

//echo $output;

// Execute js script
$params = ['test', 'btn', 'exp']; // JS params passed here...
$PAGE->requires->js_call_amd('qtype_shortmath/view-editor', 'initialize', $params);

echo $OUTPUT->footer();
