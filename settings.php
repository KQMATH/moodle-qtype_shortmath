<?php
/**
 * *
 *  * @package    qtype_shortmath
 *  * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 *  * @copyright  2020 NTNU
 *
 */

use qtype_shortmath\shortmath_urls;

defined('MOODLE_INTERNAL') || die();

$context = context_system::instance();
$PAGE->set_context($context);

$menu = [];

/**
 * Get all configuration templates from database
 */
$templates = $DB->get_records('qtype_shortmath_templates', null, 'id', 'id, name');
foreach ($templates as $template) {
    $menu[$template->id] = $template->name;
}

/**
 * Dropdown to set default editor configuration
 */
$settings->add(new admin_setting_configselect('qtype_shortmath/defaultconfiguration',
    get_string('default_config', 'qtype_shortmath'),
    get_string('default_config_desc', 'qtype_shortmath'), '', $menu));

/**
 * Link to configuration manager page
 */
$settings->add(new admin_setting_description('qtype_shortmath/templatemanager',
    get_string('manage_templates_link_desc', 'qtype_shortmath'),
    get_string('template_manager_link', 'qtype_shortmath',
        array('link' => (string)new moodle_url(shortmath_urls::$editor_manager_path)))));