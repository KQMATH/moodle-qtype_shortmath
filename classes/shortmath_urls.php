<?php
/**
 * *
 *  * @package    qtype_shortmath
 *  * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 *  * @copyright  2020 NTNU
 *
 */

namespace qtype_shortmath;

defined('MOODLE_INTERNAL') || die();

/**
 * Class shortmath_urls for definition of urls used in configuration editor
 * @package qtype_shortmath
 */
class shortmath_urls
{
    public static $editor_path = '/question/type/shortmath/view_editor.php';
    public static $editor_action_path = '/question/type/shortmath/editor_action.php';
    public static $editor_manager_path = '/question/type/shortmath/editor_manager.php';
    public static $plugin_settings_path = '/admin/settings.php?section=qtypesettingshortmath';
}