<?php
/**
 * * This script inserts a record for default editor template in the
 * * qtype_shortmath_templates table during installation.
 *
 *  * @package    qtype_shortmath
 *  * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 *  * @copyright  2020 NTNU
 *
 */


function xmldb_qtype_shortmath_install()
{
    global $DB;

    $record = new stdClass;
    $record->contextid = time(); //TODO: must change
    $record->name = 'default';

    $data = [];

    $sqrtBtn = '<span class="mq-root-block">&radic;</span>';
    $sqrtExp = '\\sqrt';
    array_push($data, getDataObject($sqrtBtn, $sqrtExp));

    $intBtn = '<span class="mq-root-block">&int;</span>';
    $intExp = '\\int';
    array_push($data, getDataObject($intBtn, $intExp));

    $sumBtn = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
    $sumExp = '\\sum';
    array_push($data, getDataObject($sumBtn, $sumExp));

    $limBtn = '<span class="mq-root-block">lim</span>';
    $limExp = '\\lim_{x\\to0';
    array_push($data, getDataObject($limBtn, $limExp));

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
    $nchoosekExp = '\\choose';
    array_push($data, getDataObject($nchoosekBtn, $nchoosekExp));


    $divideBtn = '<span class="mq-root-block">/</span>';
    $divideExp = '\\frac';
    array_push($data, getDataObject($divideBtn, $divideExp));

    $plusminusBtn = '<span class="mq-root-block">&plusmn;</span>';
    $plusminusExp = '\\pm';
    array_push($data, getDataObject($plusminusBtn, $plusminusExp));

    $thetaBtn = '<span class="mq-root-block">&theta;</span>';
    $thetaExp = '\\theta';
    array_push($data, getDataObject($thetaBtn, $thetaExp));

    $piBtn = '<span class="mq-root-block">&pi;</span>';
    $piExp = '\\pi';
    array_push($data, getDataObject($piBtn, $piExp));

    $infinityBtn = '<span class="mq-root-block">&infin;</span>';
    $infinityExp = '\\infinity';
    array_push($data, getDataObject($infinityBtn, $infinityExp));

    $caretBtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
        . '<span class="mq-root-block">'
        . '<var>x</var>'
        . '<span class="mq-supsub mq-non-leaf mq-sup-only">'
        . '<span class="mq-sup">'
        . '<var>y</var>'
        . '</span></span></span></div>';
    $caretExp = '^';
    array_push($data, getDataObject($caretBtn, $caretExp));

    $record->template = json_encode($data);

    $DB->insert_record('qtype_shortmath_templates', $record);

    return true;
}

function getDataObject($button, $expression)
{
    $object = new stdClass();
    $object->button = $button;
    $object->expression = $expression;
    return $object;
}
