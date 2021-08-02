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
 * Templates  class.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath;

defined('MOODLE_INTERNAL') || die();

/**
 * Predefined editor templates.
 *
 * @package qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2021 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class templates {
    /**
     * @var string Editor page path.
     */
    public static $editorpath = '/question/type/shortmath/view_editor.php';

    /**
     * Generate default template obj.
     * @return \stdClass
     */
    public static function default_template_obj() {
        global $USER;
        $systemcontext = \context_system::instance();

        $record = new \stdClass;
        $record->name = get_string('defaulttemplate', 'qtype_shortmath');
        $record->description = get_string('defaulttemplate_desc', 'qtype_shortmath');
        $record->userid = $USER->id;
        $record->contextid = $systemcontext->id;
        $record->timecreated = time();
        $record->template = self::default_template();
        return $record;
    }    
    
    /**
     * Generate default template string.
     * @return string
     */
    public static function default_template() {
        $data = [];
        $name = time();
    
        $sqrtbtn = '<span class="mq-root-block">&radic;</span>';
        $sqrtexp = '\\sqrt{ }';
        array_push($data, self::get_data_object($name++, $sqrtbtn, $sqrtexp));
    
        $intbtn = '<span class="mq-root-block">&int;</span>';
        $intexp = '\\int';
        array_push($data, self::get_data_object($name++, $intbtn, $intexp));
    
        $sumbtn = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
        $sumexp = '\\sum';
        array_push($data, self::get_data_object($name++, $sumbtn, $sumexp));
    
        $limbtn = '<span class="mq-root-block">lim</span>';
        $limexp = '\\lim_{x\\to0}';
        array_push($data, self::get_data_object($name++, $limbtn, $limexp));
    
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
        array_push($data, self::get_data_object($name++, $nchoosekbtn, $nchoosekexp));
    
        $dividebtn = '<span class="mq-root-block">/</span>';
        $divideexp = '\\frac{ }{ }';
        array_push($data, self::get_data_object($name++, $dividebtn, $divideexp));
    
        $plusminusbtn = '<span class="mq-root-block">&plusmn;</span>';
        $plusminusexp = '\\pm';
        array_push($data, self::get_data_object($name++, $plusminusbtn, $plusminusexp));
    
        $thetabtn = '<span class="mq-root-block">&theta;</span>';
        $thetaexp = '\\theta';
        array_push($data, self::get_data_object($name++, $thetabtn, $thetaexp));
    
        $pibtn = '<span class="mq-root-block">&pi;</span>';
        $piexp = '\\pi';
        array_push($data, self::get_data_object($name++, $pibtn, $piexp));
    
        $infinitybtn = '<span class="mq-root-block">&infin;</span>';
        $infinityexp = '\\infinity';
        array_push($data, self::get_data_object($name++, $infinitybtn, $infinityexp));
    
        $caretbtn = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">'
            . '<span class="mq-root-block">'
            . '<var>x</var>'
            . '<span class="mq-supsub mq-non-leaf mq-sup-only">'
            . '<span class="mq-sup">'
            . '<var>y</var>'
            . '</span></span></span></div>';
        $caretexp = '^{ }';
        array_push($data, self::get_data_object($name, $caretbtn, $caretexp));
        
        $template = json_encode($data);
        return $template;
    }    

    /**
     * Generate None template object.
     * @return \stdClass
     */
    public static function none_template_obj() {
        global $USER;
        $systemcontext = \context_system::instance();

        // Create none template.
        $record = new \stdClass;
        $record->name = get_string('nonetemplate', 'qtype_shortmath');
        $record->description = get_string('nonetemplate_desc', 'qtype_shortmath');
        $record->userid = $USER->id;
        $record->contextid = $systemcontext->id;
        $record->timecreated = time();
        $record->template = self::none_template();
        return $record;
    }

    /**
     * Generate None template string.
     * @return string
     */
    public static function none_template() {
        $template = '[]';
        return $template;
    }

    /**
     * Get data object helper function.
     *
     * @param int $name
     * @param string $button
     * @param string $expression
     * @return stdClass
     */
    public static function get_data_object($name, $button, $expression) {
        $object = new \stdClass();
        $object->name = 'default_' . $name;
        $object->button = $button;
        $object->expression = $expression;
        return $object;
    }
}
