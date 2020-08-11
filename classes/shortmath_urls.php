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
 *  Page url constants for ShortMath.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 */

namespace qtype_shortmath;

defined('MOODLE_INTERNAL') || die();

/**
 * Class shortmath_urls for definition of urls used in configuration editor
 * @package qtype_shortmath
 */
class shortmath_urls
{
    // editor path.
    public static $editorpath = '/question/type/shortmath/view_editor.php';
    // editor action path.
    public static $editoractionpath = '/question/type/shortmath/editor_action.php';
    // editor manager path.
    public static $editormanagerpath = '/question/type/shortmath/editor_manager.php';
    // plugin setting path.
    public static $pluginsettingspath = '/admin/settings.php?section=qtypesettingshortmath';
}