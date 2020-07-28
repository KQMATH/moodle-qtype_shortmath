<?php

use qtype_shortmath\output\manager_page;

require_once(__DIR__ . '/../../../config.php');

require_login();
$context = context_system::instance();
require_capability('moodle/site:config', $context);


$PAGE->set_context($context);
$PAGE->set_url("/question/type/shortmath/editor_manager.php");
$title = get_string('editor_manager', 'qtype_shortmath');
$PAGE->set_title($title);
$PAGE->set_heading($title);

$PAGE->requires->css('/question/type/shortmath/editor/editor_manager.css');
$PAGE->requires->string_for_js('editor_path', 'qtype_shortmath');
$PAGE->requires->string_for_js('editor_action_path', 'qtype_shortmath');
$PAGE->requires->string_for_js('plugin_settings_path', 'qtype_shortmath');

$settingsnode = $PAGE->settingsnav->add(get_string('editor_manager', 'qtype_shortmath'),
    null, navigation_node::TYPE_SETTING);
$settingsnode->make_active();

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('manage_templates', 'qtype_shortmath'));

// Get all templates from database
$templates = $DB->get_records('qtype_shortmath_templates', null, 'id');

$manager = new manager_page($templates);
echo $OUTPUT->render($manager);

echo $OUTPUT->footer();