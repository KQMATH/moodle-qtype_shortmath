<?php

require_once(__DIR__.'/../../../config.php');

$data = $_POST['data'];

/*foreach ($data as $d) {
    echo($d['expression']);
}*/

$record = new stdClass;
$record->contextid = context_user::instance($USER->id);
$record->template = $data;
$DB->insert_record('qtype_shortmath_templates', $record);
