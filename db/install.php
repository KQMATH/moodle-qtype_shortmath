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
 * This script inserts a record for default editor template in the
 * qtype_shortmath_templates table during installation.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 */

defined('MOODLE_INTERNAL') || die();

function xmldb_qtype_shortmath_install() {
    global $DB;

    $record = new stdClass;
    $record->contextid = time(); // TODO: must change
    $record->name = 'Default';

    $data = [];
    $name = time();

    $sqrtbtn = '<span class="mq-root-block">&radic;</span>';
    $sqrtexp = '\\sqrt{ }';
    array_push($data, get_data_object($name++, $sqrtbtn, $sqrtexp));

    $intbtn = '<span class="mq-root-block">&int;</span>';
    $intexp = '\\int';
    array_push($data, get_data_object($name++, $intbtn, $intexp));

    $sumbtn = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
    $sumexp = '\\sum';
    array_push($data, get_data_object($name++, $sumbtn, $sumexp));

    $limbtn = '<span class="mq-root-block">lim</span>';
    $limexp = '\\lim_{x\\to0}';
    array_push($data, get_data_object($name++, $limbtn, $limexp));

    $nchoosekbtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
        . '<span class="mq-root-block">'
        . '<span class="mq-non-leaf">'
        . '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">(</span>'
        . '<span class="mq-non-leaf" style="margin-top:0;">'
        . '<span class="mq-array mq-non-leaf">'
        . '<span style="font-size: 14px;"><var>n</var></span>'
        . '<span style="font-size: 14px;"><var>k</var></span>'
        . '</span></span>'
        . '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">)</span></span>'
        . '</span></div>';
    $nchoosekexp = '\\binom{ }{ }';
    array_push($data, get_data_object($name++, $nchoosekbtn, $nchoosekexp));

    $dividebtn = '<span class="mq-root-block">/</span>';
    $divideexp = '\\frac{ }{ }';
    array_push($data, get_data_object($name++, $dividebtn, $divideexp));

    $plusminusbtn = '<span class="mq-root-block">&plusmn;</span>';
    $plusminusexp = '\\pm';
    array_push($data, get_data_object($name++, $plusminusbtn, $plusminusexp));

    $thetabtn = '<span class="mq-root-block">&theta;</span>';
    $thetaexp = '\\theta';
    array_push($data, get_data_object($name++, $thetabtn, $thetaexp));

    $pibtn = '<span class="mq-root-block">&pi;</span>';
    $piexp = '\\pi';
    array_push($data, get_data_object($name++, $pibtn, $piexp));

    $infinitybtn = '<span class="mq-root-block">&infin;</span>';
    $infinityexp = '\\infinity';
    array_push($data, get_data_object($name++, $infinitybtn, $infinityexp));

    $caretbtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
        . '<span class="mq-root-block">'
        . '<var>x</var>'
        . '<span class="mq-supsub mq-non-leaf mq-sup-only">'
        . '<span class="mq-sup">'
        . '<var>y</var>'
        . '</span></span></span></div>';
    $caretexp = '^{ }';
    array_push($data, get_data_object($name, $caretbtn, $caretexp));

    $record->template = json_encode($data);

    $id = $DB->insert_record('qtype_shortmath_templates', $record);

    // Set default template.
    set_config('defaultconfiguration', $id, 'qtype_shortmath');

    // Create empty template.
    $record = new stdClass;
    $record->contextid = time() + 1; // TODO: must change
    $record->name = 'None';
    $record->template = '[]';
    $DB->insert_record('qtype_shortmath_templates', $record);

    return true;
}

function get_data_object($name, $button, $expression) {
    $object = new stdClass();
    $object->name = 'default_' . $name;
    $object->button = $button;
    $object->expression = $expression;
    return $object;
}
