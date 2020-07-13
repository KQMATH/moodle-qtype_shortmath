<?php

require_once(__DIR__ . '/../../../config.php');

/*//$title = get_string('pluginname', 'tool_demo');
$title = 'test';
$pagetitle = $title;
$url = new moodle_url("question/type/shortmath/editor_manager.php");
$PAGE->set_url($url);
$PAGE->set_title($title);
$PAGE->set_heading($title);

$output = $PAGE->get_renderer('qtype_shortmath');

echo $output->header();
echo $output->heading($pagetitle);*/
$manager = new \qtype_shortmath\output\manager_page();
//$manager = new \qtype_shortmath\privacy\provider();
//$renderer = $PAGE->get_renderer('qtype_shortmath');
//echo $renderer->render($manager);

/*echo $output->footer();*/