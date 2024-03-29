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
 * ShortMath urls class.
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2020 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$capabilities = array(
  'qtype/shortmath:add' => array(
    'riskbitmask' => RISK_SPAM | RISK_XSS,
    'captype' => 'write',
    'contextlevel' => CONTEXT_COURSE,
    'archetypes' => array(
        'manager' => CAP_ALLOW
    ),
  ),
  'qtype/shortmath:editmine' => array(
    'riskbitmask' => RISK_SPAM | RISK_XSS,
    'captype' => 'write',
    'contextlevel' => CONTEXT_COURSE,
    'archetypes' => array(
      'user' => CAP_ALLOW
    ),
  ),
  'qtype/shortmath:editall' => array(
    'riskbitmask' => RISK_SPAM | RISK_XSS,
    'captype' => 'write',
    'contextlevel' => CONTEXT_COURSE,
    'archetypes' => array(
      'editingteacher' => CAP_ALLOW,
      'manager' => CAP_ALLOW
    ),
  ),
  'qtype/shortmath:viewmine' => array(
    'captype' => 'read',
    'contextlevel' => CONTEXT_COURSE,
    'archetypes' => array(
      'user' => CAP_ALLOW
    ),
  ),
  'qtype/shortmath:viewall' => array(
    'captype' => 'read',
    'contextlevel' => CONTEXT_COURSE,
    'archetypes' => array(
      'editingteacher' => CAP_ALLOW,
      'manager' => CAP_ALLOW
    ),
  ),
);
