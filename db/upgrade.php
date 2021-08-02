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
 * ShortMath question type upgrade code.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use qtype_shortmath\templates;

/**
 * Upgrade code for the ShortMath question type.
 * @param int $oldversion the version we are upgrading from.
 */
function xmldb_qtype_shortmath_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();
    $result = true;

    if ($oldversion < 2018101500) {
        // Define field usecase to be removed from question_shortmath.
        $table = new xmldb_table('qtype_shortmath');
        $field1 = new xmldb_field('answers');
        $field2 = new xmldb_field('usehint');
        $field3 = new xmldb_field('studentshowalternate');

        // Delete fields.
        if ($dbman->field_exists($table, $field1)) {
            $dbman->drop_field($table, $field1);
        }
        if ($dbman->field_exists($table, $field2)) {
            $dbman->drop_field($table, $field2);
        }
        if ($dbman->field_exists($table, $field3)) {
            $dbman->drop_field($table, $field3);
        }

        // Rename table.
        if ($dbman->table_exists($table)) {
            $dbman->rename_table($table, "qtype_shortmath_options");
        }

        // Savepoint reached.
        upgrade_plugin_savepoint(true, 2018101500, 'qtype', 'shortmath');
    }

    if ($oldversion < 2021080200) {
        
        // Define table qtype_shortmath_templates to be created.
        $table = new xmldb_table('qtype_shortmath_templates');
        
        // Adding fields to table qtype_shortmath_templates.
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('name', XMLDB_TYPE_TEXT, null, null, null, null, null);
        $table->add_field('description', XMLDB_TYPE_TEXT, null, null, null, null, null);
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('contextid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('template', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null);
        $table->add_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('usermodified', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_field('timemodified', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        
        // Adding keys to table qtype_shortmath_templates.
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $table->add_key('contextid', XMLDB_KEY_FOREIGN, ['contextid'], 'context', ['id']);
        $table->add_key('userid', XMLDB_KEY_FOREIGN, ['userid'], 'user', ['id']);
        $table->add_key('usermodified', XMLDB_KEY_FOREIGN, ['usermodified'], 'user', ['id']);
        
        // Conditionally launch create table for qtype_shortmath_templates.
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }
        
        // Define field editorconfig to be added to qtype_shortmath_options.
        $table = new xmldb_table('qtype_shortmath_options');
        $field = new xmldb_field('editorconfig', XMLDB_TYPE_TEXT, null, null, null, null, null);
        // Conditionally launch add field for qtype_shortmath_options.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        
        // Create empty template.
        $record = templates::none_template_obj();
        $DB->insert_record('qtype_shortmath_templates', $record);
        
        // Create default template.
        $record = templates::default_template_obj();
        $id = $DB->insert_record('qtype_shortmath_templates', $record);
        
        // Set default template.
        set_config('defaultconfiguration', $id, 'qtype_shortmath');
        
        // Update all existing question types to use the new default template.
        $DB->set_field_select('qtype_shortmath_options', 'editorconfig', templates::default_template(), 'editorconfig IS NULL');
        
        // Savepoint reached.
        upgrade_plugin_savepoint(true, 2021080200, 'qtype', 'shortmath');
    }
    return true;
}
