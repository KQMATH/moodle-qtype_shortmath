# ShortMath
A simple question for mathematical expressions using MathQuill.

[![Build Status](https://travis-ci.org/KQMATH/moodle-qtype_shortmath.svg?branch=master)](https://travis-ci.org/KQMATH/moodle-qtype_shortmath)

## What is it?
The plugin is based on the short answer question type, but the students
enter their response in a maths editor. The studen interface is WYSIWYG
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

## Installation:  
### Moodle plugins directory
Click on **Install now** within the plugins directory, and then select your site from the list of "My sites"

### Manually
Unzip all the files into a temporary directory.
Rename the **moodle-qtype_shortmath** folder to **shortmath**, and move it into **moodle/question/type**.
The system administrator should then log in to moodle and click on the **Notifications** link in the Site administration
block.


## Uninstalling:
Delete the module from the **Activities** module list in the admin section.

## Feedback:
**Project lead:** Hans Georg Schaathun <hasc@ntnu.no>

**Developer:** [André Storhaug](https://github.com/andstor) <andr3.storhaug@gmail.com>

## License
ShortMath is licensed under the [GNU General Public, License Version 3](https://github.com/KQMATH/moodle-qtype_shortmath/LICENSE).

