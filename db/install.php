<?php
/**
 * This script inserts a record for default editor template in the
 * qtype_shortmath_templates table during installation.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 */

defined('MOODLE_INTERNAL') || die();

function xmldb_qtype_shortmath_install()
{
    global $DB;

    $record = new stdClass;
    $record->contextid = time(); //TODO: must change
    $record->name = 'Default';

    $data = [];
    $name = time();

    $sqrtBtn = '<span class="mq-root-block">&radic;</span>';
    $sqrtExp = '\\sqrt{ }';
    array_push($data, getDataObject($name++, $sqrtBtn, $sqrtExp));

    $intBtn = '<span class="mq-root-block">&int;</span>';
    $intExp = '\\int';
    array_push($data, getDataObject($name++, $intBtn, $intExp));

    $sumBtn = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
    $sumExp = '\\sum';
    array_push($data, getDataObject($name++, $sumBtn, $sumExp));

    $limBtn = '<span class="mq-root-block">lim</span>';
    $limExp = '\\lim_{x\\to0}';
    array_push($data, getDataObject($name++, $limBtn, $limExp));

    $nchoosekBtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
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
    $nchoosekExp = '\\binom{ }{ }';
    array_push($data, getDataObject($name++, $nchoosekBtn, $nchoosekExp));


    $divideBtn = '<span class="mq-root-block">/</span>';
    $divideExp = '\\frac{ }{ }';
    array_push($data, getDataObject($name++, $divideBtn, $divideExp));

    $plusminusBtn = '<span class="mq-root-block">&plusmn;</span>';
    $plusminusExp = '\\pm';
    array_push($data, getDataObject($name++, $plusminusBtn, $plusminusExp));

    $thetaBtn = '<span class="mq-root-block">&theta;</span>';
    $thetaExp = '\\theta';
    array_push($data, getDataObject($name++, $thetaBtn, $thetaExp));

    $piBtn = '<span class="mq-root-block">&pi;</span>';
    $piExp = '\\pi';
    array_push($data, getDataObject($name++, $piBtn, $piExp));

    $infinityBtn = '<span class="mq-root-block">&infin;</span>';
    $infinityExp = '\\infinity';
    array_push($data, getDataObject($name++, $infinityBtn, $infinityExp));

    $caretBtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
        . '<span class="mq-root-block">'
        . '<var>x</var>'
        . '<span class="mq-supsub mq-non-leaf mq-sup-only">'
        . '<span class="mq-sup">'
        . '<var>y</var>'
        . '</span></span></span></div>';
    $caretExp = '^{ }';
    array_push($data, getDataObject($name, $caretBtn, $caretExp));

    $record->template = json_encode($data);

    $id = $DB->insert_record('qtype_shortmath_templates', $record);

    //set default template
    set_config('defaultconfiguration', $id, 'qtype_shortmath');

    //Empty template
    $record = new stdClass;
    $record->contextid = time(); //TODO: must change
    $record->name = 'None';
    $record->template = '[]';
    $DB->insert_record('qtype_shortmath_templates', $record);

    return true;
}

function getDataObject($name, $button, $expression)
{
    $object = new stdClass();
    $object->name = 'default_' . $name;
    $object->button = $button;
    $object->expression = $expression;
    return $object;
}
