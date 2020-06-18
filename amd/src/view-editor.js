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
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */

/**
 * @module qtype_shortmath/input
 */
define(['jquery', 'qtype_shortmath/visual-math-input'], function($, VisualMath) {

    let testInput = null;
    let commandText = null;

    class EditorInput extends VisualMath.Input {

        constructor(input, parent) {
            super(input, parent);
            this.$textarea.on('blur', () => testInput = this);
        }

        change() {
            super.onEdit = ($input, field) => {
                console.log("changed ");
                /*if($input.parent('.answer').children('div').children('.mq-root-block').children('.mq-latex-command-input')
                    .attr('class') !== undefined){
                    commandText = $input.parent('.answer').children('div').children('.mq-root-block').text();
                }*/
                console.log($input.parent('.answer').children('div').children('.mq-root-block').text());
                $input.val(field.latex());
                $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
            };
        }

    }

    class EditorControl extends VisualMath.Control {

        constructor(name, text, onClick) {
            super(name, text, onClick);
        }

        enable() {
            super.enable();
            this.$element.off('click');
            this.$element.on('click', event => {
                console.log($(':focus'));
                event.preventDefault();
                if (testInput !== null) {
                    this.onClick(testInput.field);
                    testInput.field.focus();
                }
            });
            this.$element.attr('id', new Date().getTime());
            this.$element.attr('draggable', true);
            this.$element.on('dragstart', event => {
                console.log('dragstart from: '+event.target.id);
                dragged = event.target;
                nodes = Array.from(dragged.parentNode.children); //buttons on the control list
                draggedIndex = nodes.indexOf(dragged);
                // Add the target element's id to the data transfer object
                event.originalEvent.dataTransfer.setData("text", event.target.id);
                event.originalEvent.dataTransfer.dropEffect = "move";
                event.target.style.opacity = 0.5;
            });
            this.$element.on('dragend', event => {
                event.target.style.opacity = "";
                console.log('end');
                console.log($(':focus').blur());
                console.log(document.getElementById('placeholder'));
                if(document.getElementById('placeholder') !== null) {
                    document.getElementById('placeholder').replaceWith(dragged);
                }
            });
        }

    }
    let dragged;
    let target;
    let nodes;
    let draggedIndex;

    class EditorControlList {

        constructor(wrapper) {
            // this.controls = [];
            this.$wrapper = $(wrapper);
            this.$wrapper.addClass('visual-math-input-wrapper');
            // this.defineDefault();
        }

        add($btnInput, $expInput, expEditorInput) {
            /*let btnText = $btnInput.val().replace(/[{}\s]/g, '');
            let expText = $expInput.val().replace(/[{}\s]/g, '');*/
            if ($btnInput.val() === '' || $expInput.val() === '') {
                return;
            }

            console.log($btnInput.parent('.answer').children('div').html());
            console.log($expInput.parent('.answer').children('div').children('.mq-root-block').html());

            // let test = $btnInput.parent('.answer').children('div').remove();
            // console.log(test.html());

            console.log($btnInput.parent('.answer').children('div').children('.mq-root-block').html());

            let control;
            let html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%; id=${new Date().getTime()}">`;
            html += '<span class="mq-root-block">';
            html += $btnInput.parent('.answer').children('div').children('.mq-root-block').html();
            html += '</span></div>';

            let command = expEditorInput.field.latex();
            console.log('latex: '+command);
            // command = command.trim().replace(/[{}]/g, '');

            control = new EditorControl('', html, field => field.latex(command.trim()));
            // control = new EditorControl('', html, field => field.cmd(command));
            control.enable();
            this.$wrapper.append(control.$element);

            expEditorInput.field.latex('');

            /*if (expText.replace(/[{}a-z0-9A-Z\s]/g, '') === '^') {
                chars = btnText.split('^');
                console.log(chars[0] + ' ' + chars[1]);
                let caret = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
                caret += '<span class="mq-root-block">';
                caret += '<var>'+chars[0]+'</var>';
                caret += '<span class="mq-supsub mq-non-leaf mq-sup-only">';
                caret += '<span class="mq-sup">';
                caret += '<var>'+chars[1]+'</var>';
                caret += '</span></span></span></div>';
                control = new EditorControl('caret', caret, field => field.cmd('^'));
            } else if (expText.includes('lim_')) {
                chars = expText.split('\\');
                let lim = '<span class="mq-root-block">lim</span>';
                console.log('lim');
                console.log(chars);
                control = new EditorControl('lim', lim, field => {
                    field.cmd('\\lim').typedText('_').write(chars[1].split('_')[1])
                        .cmd('\\to').write(expText.split('to')[1]).moveToRightEnd();
                });
            } else if (expText.includes('binom')) {
                let nchoosek = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
                nchoosek += '<span class="mq-root-block">';
                nchoosek += '<span class="mq-non-leaf">';
                nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">(</span>';
                nchoosek += '<span class="mq-non-leaf" style="margin-top:0;">';
                nchoosek += '<span class="mq-array mq-non-leaf">';
                nchoosek += '<span style="font-size: 14px;"><var>n</var></span>';
                nchoosek += '<span style="font-size: 14px;"><var>k</var></span>';
                nchoosek += '</span></span>';
                nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">)</span></span>';
                nchoosek += '</span></div>';
                control = new EditorControl('nchoosek', nchoosek, field => field.cmd('\\choose'));
            } else if (expText.includes('sqrt')) {
                let sqrt = '<span class="mq-root-block">&radic;</span>';
                control = new EditorControl('sqrt', sqrt, field => field.cmd('\\sqrt'));
            } else if (expText.includes('int')) {
                let int = '<span class="mq-root-block">&int;</span>';
                control = new EditorControl('int', int, field => field.cmd('\\int'));
            } else if (expText.includes('sum')) {
                let sum = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
                control = new EditorControl('sum', sum, field => field.cmd('\\sum'));
            } else if (expText.includes('frac')) {
                let divide = '<span class="mq-root-block">/</span>';
                control = new EditorControl('divide', divide, field => field.cmd('\\frac'));
            } else if (expText.includes('pm')) {
                let plusminus = '<span class="mq-root-block">&plusmn;</span>';
                control = new EditorControl('plusminus', plusminus, field => field.cmd('\\pm'));
            } else if (expText.includes('theta')) {
                let theta = '<span class="mq-root-block">&theta;</span>';
                control = new EditorControl('theta', theta, field => field.cmd('\\theta'));
            } else if (expText.includes('pi')) {
                let pi = '<span class="mq-root-block">&pi;</span>';
                control = new EditorControl('pi', pi, field => field.cmd('\\pi'));
            } else if (expText.includes('infinity') || expText.includes('infty')) {
                let infinity = '<span class="mq-root-block">&infin;</span>';
                control = new EditorControl('infinity', infinity, field => field.cmd('\\infinity'));
            }
            control.enable();
            this.$wrapper.append(control.$element);*/
        }

    }

    return {
        initialize: function(inputName, readonly, btnName, expName) {

            console.log("name:  "+inputName);
            console.log("ro:  "+readonly);
            var readOnly = readonly;
            var $shortanswerInput = $('#' + $.escapeSelector(inputName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $shortanswerInput.removeClass('d-inline');
            var $parent = $('#' + $.escapeSelector(inputName)).parent('.answer');

            //var input = new VisualMath.Input($shortanswerInput, $parent);
            var input = new EditorInput($shortanswerInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();

            let editorInput = new EditorInput();
            if (!readonly) {

                editorInput.change();

            } else {
                readOnly = true;
                input.disable();
            }

            if ($shortanswerInput.val()) {
                input.field.write(
                    $shortanswerInput.val()
                );
            }

            var controlsWrapper = $('#' + $.escapeSelector(inputName)).parents('.shortmath').find('.controls_wrapper');

            controlsWrapper.addClass('visual-math-input-wrapper');
            controlsWrapper.attr('id', 'target');

            controlsWrapper.on('drop', event =>{
                event.preventDefault();
                // let targetId;
                // let _target;
                // const data = event.originalEvent.dataTransfer.getData("text");
                // let button = document.getElementById(data);
                console.log('dropping to: '+target.id);
                if (target.id === dragged.id) {
                    console.log('dont');
                    event.originalEvent.dataTransfer.clearData();
                    return;
                }
                if ($(event.target).hasClass('visual-math-input-wrapper')) {
                    console.log('dropped');
                    event.target.appendChild(dragged);
                } else {
                    document.getElementById('placeholder').replaceWith(dragged);
                }
                event.originalEvent.dataTransfer.clearData();
            });

            controlsWrapper.on('dragover', event => {
               event.preventDefault();
               event.originalEvent.dataTransfer.dropEffect = "move";
            });

           controlsWrapper.on('dragenter', event => {
               // event.preventDefault();
               console.log('drop detected');
               console.log(event.target);
               if ($(event.target).hasClass('visual-math-input-wrapper')) {
                   target = event.target;
                   return;
               }
               let targetId;
               if(event.target.nodeName !== 'BUTTON'){
                   console.log($(event.target).parents('button'));
                   targetId = $(event.target).parents('button').attr('id');
               } else {
                   targetId =  event.target.id;
               }
               // let _target = $('#' + $.escapeSelector(targetId));
               /*if(event.target.tagName === 'SPAN'){
                   targetId = event.target.parentElement.parentElement.id; //button --> div --> span
               } else {
                   targetId =  event.target.id;
                   _target = $('#' + $.escapeSelector(targetId));
               }*/
               let empty = document.createElement('button');
               $(empty).html('');
               $(empty).addClass('visual-math-input-control btn btn-primary');
               $(empty).attr('draggable', true);
               $(empty).attr('id', 'placeholder');
               $(empty).css('border', '1px solid yellow');
               console.log('targetId: ' + targetId);
               if (targetId === 'placeholder') {
                   console.log('done');
                   return;
               }
               target = document.getElementById(targetId);
               console.log('target: ' + target);
               let targetIndex = nodes.indexOf(target);
               if (draggedIndex === targetIndex) { //movement within button
                   // target = undefined;
                   return;
               }
               console.log(draggedIndex + ' to ' + targetIndex);
               if (target.parentNode.contains(dragged)) {
                   target.parentNode.removeChild(dragged);
               } else {
                   target.parentNode.removeChild(document.getElementById('placeholder'));
               }
               console.log(draggedIndex + ' to ' + targetIndex);
               if (draggedIndex < targetIndex) {
                   console.log('last:' + target.parentNode.lastChild);
                   if (target.parentNode.lastChild !== target) {
                       target.parentNode.insertBefore(empty, target.nextSibling); //left to right
                   } else {
                       target.parentNode.appendChild(empty);
                   }
               } else {
                   console.log('here:');
                   target.parentNode.insertBefore(empty, target); //right to left
               }
               nodes = Array.from(target.parentNode.children);
               draggedIndex = nodes.indexOf(empty);
               console.log('draggedIndex after: ' + draggedIndex);
           });

            let $btnInput = $('#' + $.escapeSelector(btnName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $btnInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(btnName)).parent('.answer');

            input = new EditorInput($btnInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $expInput = $('#' + $.escapeSelector(expName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $expInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(expName)).parent('.answer');

            input = new EditorInput($expInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $saveButton = $('#' + $.escapeSelector('save'));
            $saveButton.on('click', event => {
                event.preventDefault();
                console.log("save");
                let controls = new EditorControlList(controlsWrapper);
                controls.add($btnInput, $expInput, input);
                $btnInput.parent('.answer').children('div').children('.mq-root-block').html('');
                $expInput.parent('.answer').children('div').children('.mq-root-block').html('');
            });
        }
    };
});
