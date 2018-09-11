# moodle-qtype_shortmath
A simple question for simple mathematical expressions using MathQuill

## What is it?
The plugin is based on the short answer question type, Adding MathQuill
as a front-end to the answer interface to provide a WYSIWYG maths editor. 

It has been designed for use with JazzQuiz, where auto-grading is not used.  
It may be possible to auto-grade, taking advantage of the syntactic 
string match of short answer and taking into account that MathQuill
produces LaTeX output.  

In a JazzQuiz activity, only the visual representation of the mathematical
expressions are considered.  Behind the scenes LaTeX code is used.
MathJax renders this in the output, and MathQuill handles input.
The teacher will need to use LaTeX in the question text, relying on 
MathJax to render it.

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
**Project lead:** Hans Georg Schaathun: <hasc@ntnu.no>

## License
ShortMath is Licensed under the [GNU General Public, License Version 3](https://github.com/KQMATH/moodle-qtype_shortmath/LICENSE).

