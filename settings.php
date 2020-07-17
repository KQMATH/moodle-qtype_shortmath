<?php
/**
 * *
 *  * @package    qtype_shortmath
 *  * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 *  * @copyright  2020 NTNU
 *
 */

defined('MOODLE_INTERNAL') || die();

$context = context_system::instance();
$PAGE->set_context($context);

$links = array(
    get_string('template_manager_link', 'qtype_shortmath',
        array('link' => (string)new moodle_url('/question/type/shortmath/editor_manager.php'))));

// Get all templates from database
$templates = $DB->get_records('qtype_shortmath_templates', null, 'id');
$menu = [];
foreach ($templates as $template) {
    array_push($menu, $template->name);
}

$settings->add(new admin_setting_configselect('qtype_shortmath/defaultconfiguration',
    get_string('default_config', 'qtype_shortmath'),
    get_string('default_config_desc', 'qtype_shortmath'), 0 , $menu));

$settings->add(new admin_setting_description('manager',
    get_string('manage_templates_link_desc', 'qtype_shortmath'),
    implode("\n* ", $links))); // TODO: check this