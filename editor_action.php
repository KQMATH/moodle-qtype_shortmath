<?php

require_once(__DIR__ . '/../../../config.php');

$id = optional_param('id', 0, PARAM_INT);
$data = optional_param('data', '', PARAM_RAW);
$name = optional_param('name', '', PARAM_TEXT);

$record = new stdClass;
//$record->contextid = context_user::instance($USER->id)->id;
$record->id = $id;
$record->contextid = time();
$record->template = $data;
$record->name = $name;
if ($id > 0) {
    $insert = $DB->update_record('qtype_shortmath_templates', $record);
} else {
    $insert = $DB->insert_record('qtype_shortmath_templates', $record);
}

echo $insert;
