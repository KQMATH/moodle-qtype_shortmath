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