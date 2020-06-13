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

echo $OUTPUT->header();
echo $OUTPUT->heading($title);


// render page
//echo html_writer::tag('div', "Edit the file under moodle/question/type/shortmath/amd/src/view-edit.js");

//echo html_writer::tag('input', "", array('type' => 'text', 'id' => 'smath'));

$inputattributes = array(
    'type' => 'text',
    'name' => 'test',
//    'value' => '',
    'id' => 'test',
    'size' => 30,
    //'class' => 'form-control d-inline'
);

//$input = html_writer::empty_tag('input', array('id' => 'test'));
$input = html_writer::empty_tag('input', $inputattributes);

// Test
echo html_writer::start_tag('div', array('class' => 'que shortmath'));
//echo html_writer::tag('div', '', array('class' => 'info'));
//echo html_writer::start_tag('div', array('class' => 'content'));
echo html_writer::tag('div', '', array('class' => 'controls_wrapper'));
//echo html_writer::tag('div', '', array('class' => 'qtext'));
echo html_writer::start_tag('div', array('class' => 'ablock form-inline'));
echo html_writer::tag('label', 'Test:', array('for' => 'test'));
echo html_writer::tag('span', $input, array('class' => 'answer'));
echo html_writer::end_tag('div');
//echo html_writer::end_tag('div');
//echo html_writer::end_tag('div');


echo html_writer::start_tag('div', array('class' => 'ablock form-inline'));
echo html_writer::tag('label', 'Button:', array('for' => 'btn'));
echo html_writer::tag('span', html_writer::empty_tag('input',
    array('type' => 'text', 'name' => 'btn', 'id' => 'btn', 'size' => 30)),
    array('class' => 'answer'));
echo html_writer::tag('label', 'Expression:', array('for' => 'exp'));
echo html_writer::tag('span', html_writer::empty_tag('input',
    array('type' => 'text', 'name' => 'exp', 'id' => 'exp', 'size' => 30)),
    array('class' => 'answer'));
echo html_writer::end_tag('div');

echo html_writer::start_tag('div', array());
echo html_writer::tag('input', '', array('type' => 'button', 'name' => 'save',
    'id' => 'save', 'class' => 'btn btn-primary', 'value' => 'Save'));
echo html_writer::end_tag('div');

// Execute js script
$params = ['test', false, 'btn', 'exp']; // JS params passed here...
$PAGE->requires->js_call_amd('qtype_shortmath/view-editor', 'initialize', $params);

echo $OUTPUT->footer();
