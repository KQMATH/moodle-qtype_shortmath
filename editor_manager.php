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
 * Editor Manager.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use qtype_shortmath\output\templates_table;
use qtype_shortmath\output\manager_page;
use qtype_shortmath\shortmath_urls;

require_once(__DIR__ . '/../../../config.php');

require_login();
$context = context_system::instance();
require_capability('qtype/shortmath:viewall', $context);

$PAGE->set_context($context);
$url = new moodle_url(shortmath_urls::$editormanagerpath);
$returnurl = optional_param('returnurl', null, PARAM_RAW);
if (!is_null($returnurl)) {
    $url->param('returnurl', $returnurl);
}
$PAGE->set_url($url);
$title = get_string('editor_manager', 'qtype_shortmath');
$PAGE->set_title($title);
$PAGE->set_heading($title);
$PAGE->set_pagelayout('admin');

$PAGE->requires->css('/question/type/shortmath/visualmathinput/mathquill.css');
$PAGE->requires->css('/question/type/shortmath/visualmathinput/visual-math-input.css');
$PAGE->requires->css('/question/type/shortmath/editor/editor_manager.css');

//$PAGE->navbar->ignore_active();
$managernode = $PAGE->navbar->add(
    get_string('editor_manager', 'qtype_shortmath')
);

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('manage_templates', 'qtype_shortmath'));

// Get all templates except default and empty from database.
$templates = $DB->get_records_select('qtype_shortmath_templates',
    'name != \'Default\' AND name != \'None\'', null, 'id');



$table = new templates_table(uniqid(), $url, $context, $returnurl);
$manager = new manager_page($templates, $table, $returnurl);
echo $OUTPUT->render($manager);

echo $OUTPUT->footer();