<?php

require_once(__DIR__ . '/../../../config.php');

$data = $_POST['data'];
$name = $_POST['name'];

$record = new stdClass;
//$record->contextid = context_user::instance($USER->id)->id;
$record->contextid = time();
$record->template = $data;
$record->name = $name;
$insert = $DB->insert_record('qtype_shortmath_templates', $record);

echo $insert;
