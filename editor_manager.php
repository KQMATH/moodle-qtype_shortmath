<?php

use qtype_shortmath\output\manager_page;

require_once(__DIR__ . '/../../../config.php');

$context = context_system::instance();
$PAGE->set_context($context);

$title = get_string('editor_manager', 'qtype_shortmath');
$PAGE->set_url("/question/type/shortmath/editor_manager.php");
$PAGE->set_title($title);
$PAGE->set_heading($title);

$PAGE->requires->css('/question/type/shortmath/editor/editor_manager.css');

$settingsnode = $PAGE->settingsnav->add(get_string('editor_manager', 'qtype_shortmath'),
    null, navigation_node::TYPE_SETTING);
$editurl = new moodle_url('/question/type/shortmath/editor_manager.php');
$editnode = $settingsnode->add(get_string('resetpage', 'my'), $editurl);
$editnode->make_active();

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('manage_templates', 'qtype_shortmath'));

// Get all templates from database
$templates = $DB->get_records('qtype_shortmath_templates', null, 'id');

$manager = new manager_page($templates);
echo $OUTPUT->render($manager);

echo $OUTPUT->footer();