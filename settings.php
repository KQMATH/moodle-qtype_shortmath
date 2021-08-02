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
 * ShortMath settings.
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use qtype_shortmath\shortmath_urls;

defined('MOODLE_INTERNAL') || die();

$PAGE->set_url('/admin/settings.php', ['section' => 'qtypesettingshortmath']);

if ($hassiteconfig) {

    $menu = [];

    // Get all configuration templates from database.
    $templates = $DB->get_records('qtype_shortmath_templates', null, 'id', 'id, name');
    foreach ($templates as $template) {
        $menu[$template->id] = $template->name;
    }

    // Dropdown to set default editor configuration.
    $settings->add(new admin_setting_configselect('qtype_shortmath/defaultconfiguration',
        get_string('default_config', 'qtype_shortmath'),
        get_string('default_config_desc', 'qtype_shortmath'), '', $menu));

    // Link to configuration manager page.
    $returnurl = $PAGE->url->out_as_local_url(false);
    $settings->add(new admin_setting_description('qtype_shortmath/templatemanager',
        get_string('manage_templates_link_desc', 'qtype_shortmath'),
        get_string('template_manager_link', 'qtype_shortmath',
            array('link' => (string)new moodle_url(shortmath_urls::$editormanagerpath, ['returnurl' => $returnurl])))));
}
