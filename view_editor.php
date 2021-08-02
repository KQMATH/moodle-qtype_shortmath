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
 * Editor template creation page.
 *
 * @package     qtype_shortmath
 * @author      André Storhaug <andr3.storhaug@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use qtype_shortmath\form\view\editor_template_form;
use qtype_shortmath\external\editor_template;
use qtype_shortmath\output\editor_page;
use qtype_shortmath\shortmath_urls;

require_once(__DIR__ . '/../../../config.php');
require_once('lib.php');

require_login();
$context = context_system::instance();

$pageurl = new moodle_url(shortmath_urls::$editorpath);
$title = get_string('create_templates', 'qtype_shortmath');

$id = optional_param('templateid', null, PARAM_INT);
if ($id > 0) {
    template_require_capability_on($id, 'edit');
    $title = get_string('edit_template', 'qtype_shortmath');
    $pageurl->param('templateid', $id);
} else {
    require_capability('qtype/shortmath:add', $context);
}

$returnurl = optional_param('returnurl', null, PARAM_RAW);
if (!is_null($returnurl)) {
    $pageurl->param('returnurl', $returnurl);
}

$PAGE->set_context($context);
$PAGE->set_url($pageurl);
$pagetitle = get_string('template_editor', 'qtype_shortmath');

$managerpath = new \moodle_url(shortmath_urls::$editormanagerpath, ['returnurl' => $returnurl]);

//$PAGE->navbar->ignore_active();
$managernode = $PAGE->navbar->add(
    get_string('editor_manager', 'qtype_shortmath'),
    $managerpath
);

$editornode = $managernode->add(get_string('template_editor_link', 'qtype_shortmath'));

$PAGE->set_title($pagetitle);
$PAGE->set_heading($pagetitle);
$PAGE->set_pagelayout('admin');

$PAGE->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
$PAGE->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
$PAGE->requires->css('/question/type/shortmath/editor/editor.css');

// Process form actions.
$systemcontext = context_system::instance();

$mform = new editor_template_form($pageurl);

if ($mform->is_cancelled()) {
    redirect($managerpath);
} else if ($data = $mform->get_data()) {
    $templateid = $data->templateid;
    $templateobj = new stdClass();
    $templateobj->name = $data->templatename;
    $templateobj->description = $data->templatedescription;
    $templateobj->template = $data->templatestring;
    $templateobj->contextid = $systemcontext->id;
    $time = time();
    if ($templateid > 0) {
        $templateobj->id = $templateid;
        $templateobj->usermodified = $USER->id;
        $templateobj->timemodified = $time;
        $DB->update_record('qtype_shortmath_templates', $templateobj);
    } else {
        $templateobj->timecreated = $time;
        $templateobj->userid = $USER->id;
        $DB->insert_record('qtype_shortmath_templates', $templateobj);
    }
    redirect($managerpath);
}


echo $OUTPUT->header();
echo $OUTPUT->heading($title);

$editorpage = new editor_page($mform, $id);
echo $OUTPUT->render($editorpage);
echo $OUTPUT->footer();
