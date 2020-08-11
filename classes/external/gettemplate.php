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
 * @copyright  2020 NTNU
 * @license
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
 * Class gettemplate.
 * @package qtype_shortmath\external
 */
class gettemplate extends external_api
{
    /**
     * Returns description of method parameters.
     * @return external_function_parameters
     */
    public static function get_template_parameters() {
        return new external_function_parameters(
            array('questionid' => new \external_value(PARAM_INT, 'question id'))
        );
    }

    /**
     * Returns description of method result value
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
     * Returns ShortMath question template.
     * @param $questionid
     * @return array
     */
    public static function get_template($questionid) {
        global $USER, $DB;

        $editorconfig = '';
        $warnings = array();

        // Parameter validation.
        $params = self::validate_parameters(self::get_template_parameters(),
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

        if (!$DB->record_exists_select('qtype_shortmath_options', 'questionid = :questionid',
            array(
                'questionid' => $params['questionid'],
            )
        )) {
            throw new moodle_exception('cannotgetshortmathoptions', 'qtype_shortmath', '', $params['questionid']);
        }

        if (empty($warnings)) {
            $editorconfig = $DB->get_record('qtype_shortmath_options', $params)->editorconfig;
        }

        $result = array();
        $result['template'] = $editorconfig;
        $result['warnings'] = $warnings;

        return $result;
    }
}