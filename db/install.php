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
 * Inserts records into qtype_shortmath_templates table during installation.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use qtype_shortmath\templates;

/**
 * Creates records for default editor template and empty template in the database.
 *
 * @return bool
 * @throws dml_exception
 */
function xmldb_qtype_shortmath_install() {
    global $DB;

    $record = templates::default_template_obj();
    $id = $DB->insert_record('qtype_shortmath_templates', $record);
    // Set default template.
    set_config('defaultconfiguration', $id, 'qtype_shortmath');

    // Create empty template.
    $record = templates::none_template_obj();
    $DB->insert_record('qtype_shortmath_templates', $record);

    return true;
}
