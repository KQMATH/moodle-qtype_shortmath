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
 * Editor manager page class.
 *
 * @package     qtype_shortmath
 * @author      Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath\output;

defined('MOODLE_INTERNAL') || die();

use qtype_shortmath\shortmath_urls;
use renderable;
use renderer_base;
use stdClass;
use templatable;
use qtype_shortmath\form\view\editor_template_form;

/**
 * Class containing data for editor manager page.
 *
 * @package     qtype_shortmath
 * @author      Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright   2020 NTNU
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_page implements renderable, templatable
{
    /**
     * @var int templateid.
     */
    protected $templateid = null;

    /**
     * editor_page constructor.
     * @param array $templates
     */
    public function __construct(editor_template_form $form, $templateid) {
        $this->form = $form;
        $this->templateid = $templateid;
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
        global $DB;
        
        $data = new stdClass();
        if (!empty($this->templateid)) {
            $data->templateid = $this->templateid;
            $template = $DB->get_record('qtype_shortmath_templates', array('id' => $this->templateid));
            $data->templatename = $template->name;
            $data->templatedescription = $template->description;
        } else {
            $data->templateid = -1;
            $data->templatename = "";
        }

        ob_start();
        $this->form->set_data($data);
        $this->form->display();
        $edittemplateform = ob_get_contents();
        ob_end_clean();
        
        $data->edittemplateform = $edittemplateform;
        
        return $data;
    }
}