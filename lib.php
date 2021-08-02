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
 * Serve question type files
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Checks file access for short answer questions.
 *
 * @package  qtype_shortmath
 * @category files
 * @param stdClass $course course object
 * @param stdClass $cm course module object
 * @param stdClass $context context object
 * @param string $filearea file area
 * @param array $args extra arguments
 * @param bool $forcedownload whether or not force download
 * @param array $options additional options affecting the file serving
 * @return bool
 */
function qtype_shortmath_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, $options = []) {
    global $CFG;
    require_once($CFG->libdir . '/questionlib.php');
    question_pluginfile($course, $context, 'qtype_shortmath', $filearea, $args, $forcedownload, $options);
}

/**
 * Check capability on template
 *
 * @param mixed $templateorid object or id. If an object is passed,it should include ->contextid and ->userid.
 * @param string $cap 'add', 'edit', 'view'.
 * @return boolean this user has the capability $cap for this template $template?
 */
function template_has_capability_on($templateorid, $cap) {
    global $USER, $DB;

    if (is_numeric($templateorid)) {
        $template = $DB->get_record('qtype_shortmath_templates', array('id' => (int)$templateorid));
    } else if (is_object($templateorid)) {
        if (isset($templateorid->contextid) && isset($templateorid->userid)) {
            $template = $templateorid;
        }

        if (!isset($template) && isset($templateorid->id) && $templateorid->id != 0) {
            $template = $DB->get_record('qtype_shortmath_templates', array('id' => $templateorid->id));
        }
    } else {
        throw new coding_exception('$templateorid parameter needs to be an integer or an object.');
    }

    $context = context::instance_by_id($template->contextid);

    // These are existing templates capabilities.
    // Each of these has a 'mine' and 'all' version that is appended to the capability name.
    $capabilitieswithallandmine = ['edit' => 1, 'view' => 1];

    if (!isset($capabilitieswithallandmine[$cap])) {
        return has_capability('qtype/shortmath:' . $cap, $context);
    } else {
        return has_capability('qtype/shortmath:' . $cap . 'all', $context) ||
            ($template->userid == $USER->id && has_capability('qtype/shortmath:' . $cap . 'mine', $context));
    }
}

/**
 * Require capability on template.
 */
function template_require_capability_on($template, $cap) {
    if (!template_has_capability_on($template, $cap)) {
        print_error('nopermissions', '', '', $cap);
    }
    return true;
}