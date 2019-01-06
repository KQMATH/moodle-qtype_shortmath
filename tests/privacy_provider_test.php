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
 * Privacy tests for shortmath question type.
 *
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use core_privacy\tests\provider_testcase;
use qtype_shortmath\privacy\provider;

/**
 * Test case for privacy implementation.
 *
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2019 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_shortmath_privacy_testcase extends provider_testcase {
    /**
     * Test returning metadata.
     */
    public function test_get_metadata() {
        $this->resetAfterTest(true);
        $collection = new \core_privacy\local\metadata\collection('qtype_shortmath');
        $reason = provider::get_reason($collection);
        $this->assertEquals($reason, 'privacy:metadata');
        $str = 'The ShortMath question type plugin does not store any personal data.';
        $this->assertEquals($str, get_string($reason, 'qtype_shortmath'));
    }
}