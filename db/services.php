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
 * Declaration of web service and web service function for retrieving ShortMath question template.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 * @license 
 */

defined('MOODLE_INTERNAL') || die;

// We define the services to install as pre-build services. A pre-build service is not editable by administrator.
$services = array(
    'Shortmath template service' => array(
        'functions' => array(
            'qtype_shortmath_get_template'
        ),
        'restrictedusers' => 0,
        'enabled' => 1
    )
);

// We define the web service functions to install.
$functions = array(
    'qtype_shortmath_get_template' => array(
        'classname' => 'qtype_shortmath\external\gettemplate',
        'methodname' => 'get_template',
        'classpath' => '',
        'description' => 'Get the shortmath question template.',
        'type' => 'read',
        'ajax' => true,
        // 'capabilities' => 'moodle/course:managegroups',
        'capabilities' => array(),   // TODO: capabilities required by the function.
        'loginrequired' => true
    )
);
