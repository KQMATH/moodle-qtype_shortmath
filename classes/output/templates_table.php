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
 * Table of templates.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace qtype_shortmath\output;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/tablelib.php');

use context_system;
use moodle_url;
use table_sql;
use qtype_shortmath\shortmath_urls;

/**
 * Templates table.
 *
 * @package    qtype_shortmath
 * @copyright  2020 André Storhaug
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class templates_table extends table_sql {

    /**
     * @var string returnurl
     */
    var $returnurl = '';

    /**
     * Sets up the table.
     *
     * @param string $uniqueid Unique id of table.
     * @param moodle_url $url The base URL.
     */
    public function __construct($uniqueid, $url, $context, $returnurl) {
        global $CFG;
        parent::__construct($uniqueid);

        $this->context = $context;
        $this->returnurl = $returnurl;
        
        // Define columns in the table.
        $this->define_table_columns();
        // Set the baseurl.
        $this->define_baseurl($url);
        // Define configs.
        $this->define_table_configs();
        // Define SQL.
        $this->setup_sql_queries();

        $this->no_sorting('actions');
        $this->no_sorting('creator');
    }


    /**
     * Generate the display of the template name column.
     * @param object $data the table row being output.
     * @return string HTML content to go inside the td.
     */
    protected function col_id($data) {
        if ($data->id) {
            return $data->id;
        } else {
            return '-';
        }
    }

    /**
     * Generate the display of the name.
     * @param object $data the table row being output.
     * @return string HTML content to go inside the td.
     */
    protected function col_name($data) {
        global $COURSE;
        if ($data->name) {
            $templateid = $data->id;
            $url = new moodle_url(shortmath_urls::$editorpath);
            $url->param('templateid', $templateid);
            $name = \html_writer::link($url, $data->name);
            return $name;            // need to change it to correct link.
            // return '<a href="/user/profile.php?id='.$data->id.'">'.$data->name.'</a>';
        } else {
            return '-';
        }
    }

     /**
     * Generate the display of the user's full name column.
     * @param object $attempt the table row being output.
     * @return string HTML content to go inside the td.
     */
    public function col_creator($data) {
        $html = parent::col_fullname($data);
        return $html;
    }
     
    /**
     * Generate the display of the user's full name column.
     * @param object $attempt the table row being output.
     * @return string HTML content to go inside the td.
     */
    public function col_actions($data) {
            $icon = \html_writer::tag('i', '', array('class' => 'fa fa-pencil-square-o', 'aria-hidden' => 'true'));
            $editurl = new \moodle_url(shortmath_urls::$editorpath, array('templateid' => $data->id, 'returnurl' => $this->returnurl));
            $editlink = \html_writer::link($editurl, $icon, array('class' => 'edit-template m-1', 'title' => get_string('edittemplate', 'qtype_shortmath')));
            
            $icon = \html_writer::tag('i', '', array('class' => 'fa fa-trash'));
            $deletelink = \html_writer::link('', $icon, array(
                'class' => 'delete-template m-1',
                'title' => get_string('deletetemplate', 'qtype_shortmath'),
                'data-id' => $data->id,
                'data-name' => $data->name,
            ));
        return $editlink . ' ' . $deletelink;
    }

    /**
     * Generate the display of the description.
     * @param object $data the table row being output.
     * @return string HTML content to go inside the td.
     */
    protected function col_description($data) {
        if ($data->description) {
            return $data->description;
        } else {
            return '-';
        }
    }

    /**
     * Generate the display of the description.
     * @param object $data the table row being output.
     * @return string HTML content to go inside the td.
     */
    protected function col_template($data) {
        global $PAGE;

        if ($data->template) {
            $containerid = 'template-container-' . $data->id;
            $params = [$data->id, $containerid]; // JS params passed here...
            $PAGE->requires->js_call_amd('qtype_shortmath/template_preview', 'init', $params);

            $output = \html_writer::tag('div', '', array('id' => $containerid));
            return $output;
        } else {
            return '-';
        }
    }

    /**
     * The timecreated column.
     * @param stdClass $data The row data.
     * @return string
     */
    public function col_timecreated($data) {
        if ($data->timecreated) {
            return userdate($data->timecreated);
        } else {
            return '-';
        }
    }

    /**
     * Setup the headers for the table.
     */
    protected function define_table_columns() {

        // Define headers and columns.
        // TODO: define strings in lang file.
        $cols = array(
            'name' => get_string('templatename', 'qtype_shortmath'),
            'description' => get_string('templatedescription', 'qtype_shortmath'),
            'actions' => get_string('action', 'core'),
            'template' => get_string('template', 'qtype_shortmath'),
            'creator' => get_string('creator', 'qtype_shortmath'),
            'timecreated' => get_string('timecreated', 'qtype_shortmath')
        );

        $this->define_columns(array_keys($cols));
        $this->define_headers(array_values($cols));
    }

    /**
     * Define table configs.
     */
    protected function define_table_configs() {
        $this->collapsible(false);
        $this->sortable(true);
        $this->pageable(true);
    }

    /**
     * Builds the SQL query.
     *
     * @return array containing sql to use and an array of params.
     */
    public function setup_sql_queries() {
        global $DB;

        /*
        $contextids = explode('/', trim($this->context->path, '/'));
        // Get all child contexts.
        $children = $this->context->get_child_contexts();
        foreach ($children as $c) {
            $contextids[] = $c->id;
        }
        */
        $contextids = array($this->context->id);

        list($insql, $inarams) = $DB->get_in_or_equal($contextids, SQL_PARAMS_NAMED);


        // TODO: Write SQL to retrieve all rows...
        $fields = 'DISTINCT ';
        $fields .= '
                t.id AS id,
                t.name AS name,
                t.description AS description,
                t.template AS template,
                t.timecreated AS timecreated,
                u.id AS userid,
                u.picture,';
        $fields .= get_all_user_name_fields(true, 'u');
        
        $from = '{qtype_shortmath_templates} t';
        $from .= "\nJOIN {context} ctx ON t.contextid = ctx.id";
        $from .= "\nLEFT JOIN {user} u ON t.userid = u.id";
        $where = "\nctx.id $insql";
        $params = $inarams;

        // The WHERE clause is vital here, because some parts of tablelib.php will expect to
        // add bits like ' AND x = 1' on the end, and that needs to leave to valid SQL.
        $this->set_count_sql("SELECT COUNT(1) FROM (SELECT $fields FROM $from WHERE $where) temp WHERE 1 = 1", $params);

        list($fields, $from, $where, $params) = $this->update_sql_after_count($fields, $from, $where, $params);
        $this->set_sql($fields, $from, $where, $params);
    }

    /**
     * A chance for subclasses to modify the SQL after the count query has been generated,
     * and before the full query is constructed.
     * @param string $fields SELECT list.
     * @param string $from JOINs part of the SQL.
     * @param string $where WHERE clauses.
     * @param array $params Query params.
     * @return array with 4 elements ($fields, $from, $where, $params) as from base_sql.
     */
    protected function update_sql_after_count($fields, $from, $where, $params) {
        return [$fields, $from, $where, $params];
    }
}
