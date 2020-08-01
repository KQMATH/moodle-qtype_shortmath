<?php
/**
 * External (web service) function calls for retrieving ShortMath question template.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 *
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


class gettemplate extends external_api
{
    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function get_template_parameters()
    {
        return new external_function_parameters(
            array('questionid' => new \external_value(PARAM_INT, 'question id'))
        );
    }

    /**
     * Returns description of method result value
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
     * Returns ShortMath question template
     * @param $questionid
     * @return array
     * @throws dml_exception
     * @throws invalid_parameter_exception
     * @throws moodle_exception
     * @throws restricted_context_exception
     */
    public static function get_template($questionid)
    {
        global $USER, $DB;

        $editorconfig = '';
        $warnings = array();

        //Parameter validation
        $params = self::validate_parameters(self::get_template_parameters(),
            array(
                'questionid' => $questionid,
            )
        );

        //Context validation
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