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
require_once(__DIR__ . '/../../../config.php');

$id = optional_param('templateId', 0, PARAM_INT);
$data = NULL;
if($id > 0) {
    $data = (object) array( 'id' => $id,
        'name' => optional_param('templateName', '', PARAM_TEXT),
        'template' => optional_param('templateData', '', PARAM_RAW)
    );
}

$context = context_system::instance();
$PAGE->set_context($context);
$pageurl = new moodle_url('/question/type/shortmath/view_editor.php');
$PAGE->set_url($pageurl);
$pagetitle = "Editor configuration";
$PAGE->set_title($pagetitle);
$PAGE->set_heading($pagetitle);
$PAGE->set_pagelayout('standard');

$PAGE->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
$PAGE->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
$PAGE->requires->css('/question/type/shortmath/editor/editor.css');

$title = get_string('add_templates', 'qtype_shortmath');
$settingsnode = $PAGE->settingsnav->add($title, null, navigation_node::TYPE_SETTING);
$editnode = $settingsnode->add(get_string('resetpage', 'my'), $pageurl);
$editnode->make_active();

echo $OUTPUT->header();
echo $OUTPUT->heading($title);

// Execute js script
$params = ['test', 'btn', 'exp', $data]; // JS params passed here...
$PAGE->requires->js_call_amd('qtype_shortmath/view-editor', 'initialize', $params);

echo $OUTPUT->footer();
