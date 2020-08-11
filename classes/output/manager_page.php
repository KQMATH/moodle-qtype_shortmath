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
 * qtype_shortmath\output.
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license
 */
namespace qtype_shortmath\output;

defined('MOODLE_INTERNAL') || die();

use qtype_shortmath\shortmath_urls;
use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * Class manager_page.
 * @package qtype_shortmath\output
 */
class manager_page implements renderable, templatable
{
    // template variable.
    protected $templates = array();

    /**
     * manager_page constructor.
     * @param array $templates
     */
    public function __construct(array $templates) {
        $this->templates = $templates;
    }

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     * @return stdClass|array
     */
    public function export_for_template(renderer_base $output) {
        return [
            "buttonClass" => "btn btn-primary",
            "templates" => new \ArrayIterator($this->templates),
            "editor_path" => shortmath_urls::$editorpath,
            "editor_action_path" => shortmath_urls::$editoractionpath,
            "plugin_settings_path" => shortmath_urls::$pluginsettingspath
        ];
    }
}