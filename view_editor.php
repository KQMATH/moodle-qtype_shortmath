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

require_login();

$title = get_string('create_templates', 'qtype_shortmath');

$id = optional_param('templateId', 0, PARAM_INT);
$name = optional_param('templateName', '', PARAM_TEXT);
if ($id > 0) {
    $title = get_string('edit_template', 'qtype_shortmath');
}

$context = context_system::instance();
$PAGE->set_context($context);
$pageurl = new moodle_url(get_string('editor_path', 'qtype_shortmath'));
$PAGE->set_url($pageurl);
$pagetitle = "Editor configuration";
$PAGE->set_title($pagetitle);
$PAGE->set_heading($pagetitle);
$PAGE->set_pagelayout('standard');

$PAGE->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
$PAGE->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
$PAGE->requires->css('/question/type/shortmath/editor/editor.css');
$PAGE->requires->string_for_js('editor_action_path', 'qtype_shortmath');
$PAGE->requires->string_for_js('editor_manager_path', 'qtype_shortmath');

$settingsnode = $PAGE->settingsnav->add($pagetitle, null, navigation_node::TYPE_SETTING);
$editnode = $settingsnode->add(get_string('resetpage', 'my'), $pageurl);
$editnode->make_active();

echo $OUTPUT->header();
echo $OUTPUT->heading($title);

// Execute js script
$params = ['test', 'btn', 'exp', $id, $name]; // JS params passed here...
$PAGE->requires->js_call_amd('qtype_shortmath/view-editor', 'initialize', $params);

echo $OUTPUT->footer();
