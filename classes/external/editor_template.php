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
 * External (web service) function calls for retrieving ShortMath question template.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @author     Simen Wiik <simenwiik@hotmail.com>
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2021 NTNU
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath\external;

use dml_exception;
use external_api;
use external_function_parameters;
use external_single_structure;
use invalid_parameter_exception;
use moodle_exception;
use restricted_context_exception;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . "/externallib.php");
require_once(__DIR__ . '/../../lib.php');

/**
 * Editor template web service class for getting, saving and deleting templates.
 *
 * @package     qtype_shortmath
 * @author      Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_template extends external_api {
    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function get_template_parameters() {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'Template Id', VALUE_REQUIRED, 0),
            )
        );
    }

    /**
     * Returns ShortMath question template.
     *
     * @param int $templateid template id relating to the mdl_qtype_shortmath_templates table
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function get_template($templateid) {
        global $USER, $DB;

        $warnings = array();

        // Parameter validation.
        $params = self::validate_parameters(
            self::get_template_parameters(),
            array(
                'id' => $templateid,
            )
        );

        // Context validation.
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        template_require_capability_on($params['id'], 'view');

        if (!$DB->record_exists_select(
            'qtype_shortmath_templates',
            'id = :templateid',
            array('templateid' => $params['id'])
        )) {
            throw new moodle_exception('cannotgetshortmathtemplate', 'qtype_shortmath', '', $params['id']);
        }
        $result = array();

        if (empty($warnings)) {
            $template = $DB->get_record('qtype_shortmath_templates', $params)->template;
        }

        $result = array();
        $result['template'] = $template;
        $result['warnings'] = $warnings;

        return $result;
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function get_template_returns() {
        return new external_single_structure(
            array(
                'template' => new \external_value(PARAM_RAW, 'toolbar template'),
                'warnings' => new \external_warnings()
            )
        );
    }

    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function save_template_parameters() {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'Template id', VALUE_REQUIRED, 0),
                'name' => new \external_value(PARAM_TEXT, 'Template name'),
                'template' => new \external_value(PARAM_RAW, 'Toolbar template')
            )
        );
    }

    /**
     * Saves a ShortMath question template to the database.
     * 
     * There are three outcomes when using this function:
     * 1. $newid = -1 => Failed to update existing template
     * 2. $newid =  0 => Failed to create a new template
     * 3. $newid >  0 => Success, returning template id
     *
     * @param int $templateid template id relating to the mdl_qtype_shortmath_templates table
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function save_template($name, $template, $templateid) {
        global $USER, $DB;

        $result = array();
        $warnings = array();

        // Parameter validation.
        $params = self::validate_parameters(
            self::save_template_parameters(),
            array(
                'id' => $templateid,
                'name' => $name,
                'template' => $template
            )
        );

        // Later, the contextid will be used to let people with the teacher role manage templates. This is 
        // just a temporary solution. https://docs.moodle.org/310/en/Managing_roles
        $context = context_system::instance();
        $params["contextid"] = $context->id;

        // Context validation.
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        $newid = 0;

        if ($params['id'] > 0) {
            template_require_capability_on($params['id'], 'edit');
            try {
                $DB->update_record('qtype_shortmath_templates', $params);
                $result["success"] = True;
            } catch (dml_exception $e) {
                echo $e;
                $result["success"] = False;
            }
        } else {
            if (!has_capability('qtype/shortmath:add', $context)) {
                throw new \moodle_exception('cannotsavegettemplate', 'qtype_shortmath');
            }
            try {
                $DB->insert_record('qtype_shortmath_templates', $params, $newid);
                $result["success"] = True;
            } catch (dml_exception $e) {
                echo $e;
                $newid = -1;
                $result["success"] = False;
            }
        }

        $result["id"] = $newid;

        return $result;
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function save_template_returns() {
        return new external_single_structure(
            array(
                'id' => new \external_value(PARAM_RAW, 'id'),
                'success' => new \external_value(PARAM_BOOL, 'Success (true=success, false=failure)')
            )
        );
    }

    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function delete_template_parameters() {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'template id')
            )
        );
    }

    /**
     * Deletes a ShortMath question template from the database.
     *
     * @param int $templateid id relating to the mdl_qtype_shortmath_template table
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function delete_template($templateid) {
        global $USER, $DB;

        // Parameter validation.
        $params = self::validate_parameters(
            self::delete_template_parameters(),
            array(
                'id' => $templateid,
            )
        );

        // Context validation.
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        template_require_capability_on($params['id'], 'edit');

        if (!$DB->delete_records_select(
            'qtype_shortmath_templates',
            'id = :templateid',
            array(
                'templateid' => $params['id'],
            )
        )) {
            throw new moodle_exception('cannotgetshortmathtemplate', 'qtype_shortmath', '', $params['id']);
        }

        $result = array();
        $result['success'] = True;

        return $result;
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function delete_template_returns() {
        return new external_single_structure(
            array(
                'success' => new \external_value(PARAM_BOOL, 'Success (true=success, false=failure)')
            )
        );
    }
}
