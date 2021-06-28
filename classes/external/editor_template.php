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
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com> and Simen Wiik <simenwiik@hotmail.com>
 * @copyright  2020 NTNU
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath\external;

use dml_exception;
use external_api;
use external_function_parameters;
use external_single_structure;
use external_warnings;
use invalid_parameter_exception;
use moodle_exception;
use restricted_context_exception;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . "/externallib.php");

/**
 * Editor template web service class for getting, saving and deleting templates.
 *
 * @package     qtype_shortmath
 * @author      Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_template extends external_api
{
    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function get_template_parameters()
    {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'Template Id', VALUE_REQUIRED, 0),
            )
        );
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function get_template_returns()
    {
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
    public static function save_template_parameters()
    {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'Template id', VALUE_REQUIRED, 0),
                'name' => new \external_value(PARAM_TEXT, 'Template name'),
                'template' => new \external_value(PARAM_RAW, 'Toolbar template')
            )
        );
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function save_template_returns()
    {
        return new external_single_structure(
            array(
                'success' => new \external_value(PARAM_BOOL, 'Success (true=success, false=failure)')
            )
        );
    }

    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function delete_template_parameters()
    {
        return new external_function_parameters(
            array(
                'questionid' => new \external_value(PARAM_INT, 'question id')
            )
        );
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function delete_template_returns()
    {
        return new external_single_structure(
            array(
                'success' => new \external_value(PARAM_BOOL, 'Success (true=success, false=failure)')
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
    public static function get_template($templateid)
    {
        global $USER, $DB;

        $editorconfig = '';
        $warnings = array();

        // Parameter validation.
        $params = self::validate_parameters(
            self::get_template_parameters(),
            array(
                'id' => $templateid,
            )
        );

        // Context validation.
        // TODO: ensure proper validation....
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        // TODO: Capability checking
        if (!has_capability('qtype/shortmath:viewalltemplates', $context)) {
            throw new \moodle_exception('cannotviewtemplate', 'qtype_shortmath');
        }

        if (!$DB->record_exists_select(
            'qtype_shortmath_templates',
            'id = :templateid',
            array('templateid' => $params['id'])
        )) {
            throw new moodle_exception('cannotgetshortmathoptions', 'qtype_shortmath', '', $params['questionid']);
        }
        $result = array();

        if (empty($warnings)) {
            $templateFound = $DB->get_record('qtype_shortmath_templates', $params)->template;
        }


        $result = array();
        $result['template'] = $templateFound;
        $result['warnings'] = $warnings;

        return $result;
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
    public static function save_template($name, $template, $templateid)
    {
        global $USER, $DB;

        $result = array();

        // $editorconfig = '';
        // $warnings = array();

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
        // $params["contextid"] = time();

        // Context validation.
        // TODO: ensure proper validation....
        // $context = \context_user::instance($USER->id);
        // self::validate_context($context);

        // TODO: Capability checking
        /*if (!has_capability('local/qtracker:readissue', $context)) {
            throw new \moodle_exception('cannotgetissue', 'local_qtracker');
        }*/
        // $newid = 0;

        // if ($templateid > 0) {
        //     try {
        //         $DB->update_record('qtype_shortmath_templates', $params);
        //         $result["success"] = TRUE;
        //     } catch (dml_exception $e) {
        //         echo $e;
        //         $result["success"] = FALSE;
        //     }
        // } else {
        //     try {
        //         $DB->insert_record('qtype_shortmath_templates', $params, $newid);
        //         $result["success"] = TRUE;
        //     } catch (dml_exception $e) {
        //         echo $e;
        //         $newid = -1;
        //         $result["success"] = FALSE;
        //     }
        // }

        // $result["newId"] = $newid;

        // return $result;
        return 15;
    }

    /**
     * Deletes a ShortMath question template from the database.
     *
     * @param int $questionid question id relating to the mdl_qtype_shortmath_options table
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function delete_template($questionid)
    {
        global $USER, $DB;

        // Parameter validation.
        $params = self::validate_parameters(
            self::delete_template_parameters(),
            array(
                'questionid' => $questionid,
            )
        );

        // Context validation.
        // TODO: ensure proper validation....
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        // TODO: Capability checking
        /*if (!has_capability('local/qtracker:readissue', $context)) {
            throw new \moodle_exception('cannotgetissue', 'local_qtracker');
        }*/

        if (!$DB->delete_records_select(
            'qtype_shortmath_templates',
            'id = :questionid',
            array(
                'questionid' => $params['questionid'],
            )
        )) {
            throw new moodle_exception('cannotgetshortmathoptions', 'qtype_shortmath', '', $params['questionid']);
        }

        $result = array();
        $result['success'] = TRUE;

        return $result;
    }

    // $record = new stdClass;
    // $record->contextid = context_user::instance($USER->id)->id;
    // $record->id = $id;
    // $record->template = $data;
    // $record->name = $name;
    // if ($id > 0) {
    //     if ($type == 'delete') {
    //         $return = $DB->delete_records('qtype_shortmath_templates', array_filter((array)$record));
    //     } else if ($type == 'get') {
    //         $return = json_encode($DB->get_record('qtype_shortmath_templates', array_filter((array)$record)));
    //     } else {
    //         $return = $DB->update_record('qtype_shortmath_templates', $record);
    //     }
    // } else {
    //     $record->contextid = time();
    //     $return = $DB->insert_record('qtype_shortmath_templates', $record);
    // }

    // echo $return;
}
