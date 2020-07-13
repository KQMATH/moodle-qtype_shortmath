<?php

namespace qtype_shortmath\output;

defined('MOODLE_INTERNAL') || die();

use renderable;
use renderer_base;
use stdClass;
use templatable;

class manager_page implements renderable, templatable
{
    /**
     * manager_page constructor.
     */
    /*public function __construct()
    {
    }*/

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     * @return stdClass|array
     */
    public function export_for_template(renderer_base $output)
    {
        // TODO: Implement export_for_template() method.
        return new stdClass();
    }
}