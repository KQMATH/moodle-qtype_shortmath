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


echo $OUTPUT->header();
echo $OUTPUT->heading($title);


// render page
echo html_writer::tag('div', "Edit the file under moodle/question/type/shortmath/amd/src/view-edit.js");


// Execute js script
$params = []; // JS params passed here...
$PAGE->requires->js_call_amd('qtype_shortmath/view-editor', 'initialize', $params);

echo $OUTPUT->footer();
