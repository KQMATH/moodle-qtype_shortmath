<?php

require_once(__DIR__.'/../../../config.php');

$data = $_POST['data'];

/*foreach ($data as $d) {
    echo($d['expression']);
}*/
global $DB;

$record = new stdClass;
//$record->contextid = context_user::instance($USER->id)->id;
$record->contextid = time();
$record->template = $data;
$insert = $DB->insert_record('qtype_shortmath_templates', $record);
echo $insert;
