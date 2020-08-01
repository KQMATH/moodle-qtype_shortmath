<?php
/**
 * Declaration of web service and web service function for retrieving ShortMath question template
 *
 * @package    qtype_shortmath
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 *
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
        //'capabilities' => 'moodle/course:managegroups',
        'capabilities' => array(),   // TODO: capabilities required by the function.
        'loginrequired' => true
    )
);
