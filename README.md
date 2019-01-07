# ShortMath
[![Build Status](https://travis-ci.org/KQMATH/moodle-qtype_shortmath.svg?branch=master)](https://travis-ci.org/KQMATH/moodle-qtype_shortmath)
[![Coverage Status](https://coveralls.io/repos/github/KQMATH/moodle-qtype_shortmath/badge.svg?branch=master)](https://coveralls.io/github/KQMATH/moodle-qtype_shortmath?branch=master)

A simple question type for mathematical expressions using MathQuill.

## What is it?
The plugin is based on the short answer question type, but the students
enter their response in a maths editor. The student interface is WYSIWYG
(what you see is what you get).

The editor interface is provided by MathQuill, which produces LaTeX
code that is used as the internal representation. Rendering relies
on MathJax which provides mathematically correct visual rendering.


ShortMath has been designed for use with JazzQuiz, where auto-grading is 
not used. However, if desired, auto-grading based on syntactic string match on the
LaTeX code is supported.

**See also** 
+ [ShortMath in the Moodle plugin repository](https://moodle.org/plugins/qtype_shortmath)
+ [JazzQuiz at github](https://github.com/KQMATH/moodle-mod_jazzquiz)
+ [JazzQuiz in the Moodle plugin repository](https://moodle.org/plugins/mod_jazzquiz)

## Documentation
Documentation is available [here](https://github.com/KQMATH/moodle-qtype_shortmath/wiki), including [installation instructions](https://github.com/KQMATH/moodle-qtype_shortmath/wiki/Installation-instructions).

## Feedback:
**Project lead:** Hans Georg Schaathun <hasc@ntnu.no>

**Developer:** [André Storhaug](https://github.com/andstor) <andr3.storhaug@gmail.com>

## License
ShortMath is licensed under the [GNU General Public, License Version 3](https://github.com/KQMATH/moodle-qtype_shortmath/LICENSE).

