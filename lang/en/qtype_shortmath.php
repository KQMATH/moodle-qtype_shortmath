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
 * Language strings for the ShortMath question type.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>, Sebastian S. Gundersen <sebastsg@stud.ntnu.no>
 *             and Hans Georg Schaathun <hasc@ntnu.no>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'ShortMath';
$string['pluginname_help'] = 'Short answer question type for mathematical expressions using MathQuill, resulting in LaTeX answers.';
$string['pluginname_link'] = 'question/type/shortmath';
$string['pluginnameadding'] = 'Adding a ShortMath question';
$string['pluginnameediting'] = 'Editing a ShortMath question';
$string['pluginnamesummary'] = 'Short answer question type for mathematical expressions using MathQuill, resulting in LaTeX answers.';
$string['privacy:metadata'] = 'The ShortMath question type plugin does not store any personal data.';

$string['filloutoneanswer'] = 'You must provide at least one possible answer, written in a valid latex math format. Answers left blank will not be used. \'*\' can be used as a wildcard to match any characters. The first matching answer will be used to determine the score and feedback.';
$string['template_manager_link'] = '<a href="{$a->link}" class="d-inline-block mb-3">Manage templates</a>';
$string['create_templates'] = 'Create templates';
$string['create_template'] = 'Create template';
$string['new_template'] = 'New template';
$string['default_config'] = 'Default configuration';
$string['default_config_desc'] = 'The default editor configuration.';
$string['editor_manager'] = 'Editor Manager';
$string['manage_templates'] = 'Manage Templates';
$string['manage_templates_link_desc'] = 'Template Manager';
$string['deltemplate'] = 'Delete template';
$string['deltemplateconfirm'] = 'Are you sure you want to delete the template <b>{$a}</b>?';
$string['edit_template'] = 'Edit template';
$string['toolbar_template'] = 'Toolbar template';
$string['toolbar_template_help'] = 'The toolbar template determines how the editor toolbar looks. When changing the toolbar configuration by changing the template, you will have to confirm the overwrite.';

$string['cannotcreatetemplate'] = 'Cannot ShortMath template.';
$string['cannotgetshortmathtemplate'] = 'Cannot get ShortMath template with ID {$a}.';
$string['cannotgetshortmathoptions'] = 'Cannot get ShortMath options for question ID {$a}.';
$string['youmustconfirm'] = 'You must confirm here.';
$string['configchangeconfirm'] = 'I confirm that I want to change the template used for this question.';

$string['template_editor'] = 'Template Editor';
$string['template_editor_link'] = 'Template Editor';

$string['template'] = 'Template';
$string['templateconfiguration'] = 'Template configuration';
$string['templatename'] = 'Name';
$string['templatename_help'] = 'The name to set for the template.';
$string['templatedescription'] = 'Description';
$string['templatedescription_help'] = 'The description to set for the template.';
$string['addbuttons'] = 'Add buttons';
$string['preview'] = 'Preview';
$string['add'] = 'Add';
$string['templatebutton'] = 'Template button';
$string['createbutton'] = 'Create button';
$string['button'] = 'Button';
$string['createbutton_help'] = 'Write an expression in the input field. When pressing the "Add" button, a new button will be created with this input as the display text.';
$string['templatevalue'] = 'Value';
$string['templatevalue_help'] = 'In this input, you may specify a value for the button definedin the field above. Write an expression in the input field. When pressing the "Add" button, a new button will be created which produces the value according to this input.';
$string['templatepreview'] = 'Template preview';
$string['templatepreview_help'] = 'Here you may test the buttons created for this template. It is purely for testing purposes.';
$string['mqcontrolsgroup'] = 'Template button';
$string['mqcontrolsgroup_help'] = 'Here is a preview of the toolbar with the current configurations. By clicking and dragging the buttons, the ordering of the buttons can be changed. To delete a button, click and drag the button down to the trash can that appears. You may also test the buttons by just clicking them. The result will appear in the testing input below.';
$string['mqbuttongroup'] = 'Create buttton';
$string['mqbuttongroup_help'] = 'In the <b>Button</b> input field you can specify what will show on the buttton. In the <b>Value</b> fild you specify what the value the button produces when clicked. When pressing the <b>Add button</b>, a new button will be created.';
$string['addbtn'] = 'Add button';
$string['templatetest'] = 'Test template';
$string['testinput'] = 'Test input';

$string['edittemplate'] = 'Edit template';
$string['deletetemplate'] = 'Delete template';
$string['timecreated'] = 'Time created';
$string['creator'] = 'Creator';
$string['toolbar'] = 'Toolbar';
$string['toolbargroup'] = 'Toolbar';
$string['toolbargroup_help'] = 'This is a preview of how the toolbar will look like.';

$string['nonetemplate'] = 'None';
$string['nonetemplate_desc'] = 'An empty template with no buttons.';
$string['defaulttemplate'] = 'Default';
$string['defaulttemplate_desc'] = 'The default template.';

$string['shortmath:add'] = 'Add new templates';
$string['shortmath:editmine'] = 'Edit your own templates';
$string['shortmath:editall'] = 'Edit all templates';
$string['shortmath:viewmine'] = 'Edit your own templates';
$string['shortmath:viewall'] = 'View all templates';
