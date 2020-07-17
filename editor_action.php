<?php

require_once(__DIR__ . '/../../../config.php');

$id = optional_param('id', 0, PARAM_INT);
$data = optional_param('data', '', PARAM_RAW);
$name = optional_param('name', '', PARAM_TEXT);
$type = optional_param('type', '', PARAM_TEXT);

$record = new stdClass;
//$record->contextid = context_user::instance($USER->id)->id;
$record->id = $id;
$record->template = $data;
$record->name = $name;
if ($id > 0) {
    if ($type == 'delete') {
        $return = $DB->delete_records('qtype_shortmath_templates', array_filter((array)$record));
    } else {
        $return = $DB->update_record('qtype_shortmath_templates', $record);
    }
} else {
    $record->contextid = time();
    $return = $DB->insert_record('qtype_shortmath_templates', $record);
}

echo $return;
