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
 * Editor Action.
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../config.php');

require_login();

$id = optional_param('id', 0, PARAM_INT);
$data = optional_param('data', '', PARAM_RAW);
$name = optional_param('name', '', PARAM_TEXT);
$type = optional_param('type', '', PARAM_TEXT);

$record = new stdClass;
// $record->contextid = context_user::instance($USER->id)->id;
$record->id = $id;
$record->template = $data;
$record->name = $name;
if ($id > 0) {
    if ($type == 'delete') {
        $return = $DB->delete_records('qtype_shortmath_templates', array_filter((array)$record));
    } else if ($type == 'get') {
        $return = json_encode($DB->get_record('qtype_shortmath_templates', array_filter((array)$record)));
    } else {
        $return = $DB->update_record('qtype_shortmath_templates', $record);
    }
} else {
    $record->contextid = time();
    $return = $DB->insert_record('qtype_shortmath_templates', $record);
}

echo $return;
