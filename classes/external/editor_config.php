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

/**
 * Editor config web service class for getting editor configurations for a question.
 *
 * @package     qtype_shortmath
 * @author      Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_config extends external_api {
    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function get_editor_config_parameters() {
        return new external_function_parameters(
            array(
                'id' => new \external_value(PARAM_INT, 'Question ID', VALUE_REQUIRED, 0),
            )
        );
    }

    /**
     * Returns ShortMath question editorconfig.
     *
     * @param int $templateid template id relating to the mdl_qtype_shortmath_templates table
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function get_editor_config($questionid) {
        global $USER, $DB;

        $editorconfig = '';
        $warnings = array();

        // Parameter validation.
        $params = self::validate_parameters(
            self::get_editor_config_parameters(),
            array(
                'id' => $questionid,
            )
        );

        // Context validation.
        $context = \context_user::instance($USER->id);
        self::validate_context($context);

        if (!$DB->record_exists_select(
            'qtype_shortmath_options',
            'questionid = :questionid',
            array('questionid' => $params['id'])
        )) {
            throw new moodle_exception('cannotgetshortmathoptions', 'qtype_shortmath', '', $params['questionid']);
        }
        $result = array();

        if (empty($warnings)) {
            $editorconfig = $DB->get_record('qtype_shortmath_options', array('questionid' => $params['id']))->editorconfig;
        }


        $result = array();
        $result['editorconfig'] = $editorconfig;
        $result['warnings'] = $warnings;

        return $result;
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function get_editor_config_returns() {
        return new external_single_structure(
            array(
                'editorconfig' => new \external_value(PARAM_RAW, 'toolbar template'),
                'warnings' => new \external_warnings()
            )
        );
    }
}
