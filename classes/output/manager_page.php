<?php

namespace qtype_shortmath\output;

defined('MOODLE_INTERNAL') || die();

use qtype_shortmath\shortmath_urls;
use renderable;
use renderer_base;
use stdClass;
use templatable;

class manager_page implements renderable, templatable
{
    protected $templates = array();

    /**
     * manager_page constructor.
     * @param array $templates
     */
    public function __construct(array $templates)
    {
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
    public function export_for_template(renderer_base $output)
    {
        return [
            "buttonClass" => "btn btn-primary",
            "templates" => new \ArrayIterator($this->templates),
            "editor_path" => shortmath_urls::$editor_path,
            "editor_action_path" => shortmath_urls::$editor_action_path,
            "plugin_settings_path" => shortmath_urls::$plugin_settings_path
        ];
    }
}