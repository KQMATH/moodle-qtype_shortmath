#!/usr/bin/env bash

moodle-plugin-ci phplint
moodle-plugin-ci phpcpd
moodle-plugin-ci phpmd
moodle-plugin-ci codechecker
moodle-plugin-ci validate
moodle-plugin-ci savepoints
moodle-plugin-ci mustache
moodle-plugin-ci grunt -t eslint:amd
moodle-plugin-ci phpunit --coverage-clover
moodle-plugin-ci behat