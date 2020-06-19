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

    class EditorInput extends VisualMath.Input {

        constructor(input, parent) {
            super(input, parent);
            this.$textarea.on('blur', () => testInput = this);
        }

        change() {
            super.onEdit = ($input, field) => {
                $input.val(field.latex());
                $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
            };
        }

    }

    class EditorControl extends VisualMath.Control {

        constructor(text, onClick) {
            super('', text, onClick);
        }

        enable() {
            super.enable();

            this.$element.off('click');
            this.$element.on('click', event => {
                event.preventDefault();
                console.log($(':focus'));
                if (testInput !== null) {
                    console.log(testInput.field.latex())
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
            if ($btnInput.val() === '' || $expInput.val() === '') {
                return;
            }

            let control;
            let html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%; id=${new Date().getTime()}">`;
            html += '<span class="mq-root-block">';
            html += $btnInput.parent('.answer').children('div').children('.mq-root-block').html();
            html += '</span></div>';

            let command = expEditorInput.field.latex();
            console.log('latex: '+command);

            control = new EditorControl(html, field => field.latex(command.trim()));
            // control = new VisualMath.Control('', html, field => field.latex(command.trim()));
            control.enable();
            this.$wrapper.append(control.$element);

            expEditorInput.field.latex('');

        }

    }

    return {
        initialize: function(testInputName, btnInputName, expInputName) {

            console.log("name:  "+testInputName);
            var $shortanswerInput = $('#' + $.escapeSelector(testInputName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $shortanswerInput.removeClass('d-inline');
            var $parent = $('#' + $.escapeSelector(testInputName)).parent('.answer');

            // var input = new VisualMath.Input($shortanswerInput, $parent);
            var input = new EditorInput($shortanswerInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            if ($shortanswerInput.val()) {
                input.field.write(
                    $shortanswerInput.val()
                );
            }

            var controlsWrapper = $('#' + $.escapeSelector(testInputName)).parents('.shortmath').find('.controls_wrapper');

            controlsWrapper.addClass('visual-math-input-wrapper');
            controlsWrapper.attr('id', 'target');

            controlsWrapper.on('drop', event =>{
                event.preventDefault();

                console.log('dropping to: '+target.id);
                if (target.id === dragged.id) {
                    console.log('dont');
                    event.originalEvent.dataTransfer.clearData();
                    return;
                }

                console.log('dropped');
                document.getElementById('placeholder').replaceWith(dragged);
                event.originalEvent.dataTransfer.clearData();
            });

            controlsWrapper.on('dragover', event => {
               event.preventDefault();
               event.originalEvent.dataTransfer.dropEffect = "move";
            });

           controlsWrapper.on('dragenter', event => {
               console.log('drop detected');
               console.log(event.target);

               let targetId;
               if ($(event.target).hasClass('visual-math-input-wrapper')){
                   targetId = event.target.lastChild.id;
               }else if(event.target.nodeName !== 'BUTTON'){
                   console.log($(event.target).parents('button'));
                   targetId = $(event.target).parents('button').attr('id');
               } else {
                   targetId =  event.target.id;
               }

               console.log('targetId: ' + targetId);
               if (targetId === 'placeholder') {
                   console.log('done');
                   return;
               }

               target = document.getElementById(targetId);
               console.log('target: ' + target);

               let targetIndex = nodes.indexOf(target);
               if (draggedIndex === targetIndex) { //movement within button
                   return;
               }

               let empty = document.createElement('button');
               $(empty).html('');
               $(empty).addClass('visual-math-input-control btn btn-primary');
               $(empty).attr('draggable', true);
               $(empty).attr('id', 'placeholder');
               $(empty).css('border', '2px solid red');

               console.log(draggedIndex + ' to ' + targetIndex);
               if (target.parentNode.contains(dragged)) {
                   target.parentNode.removeChild(dragged);
               } else {
                   target.parentNode.removeChild(document.getElementById('placeholder'));
               }

               if (draggedIndex < targetIndex) {
                   console.log('last:' + target.parentNode.lastChild);
                   if (target.parentNode.lastChild !== target) {
                       target.parentNode.insertBefore(empty, target.nextSibling); //left to right
                   } else {
                       target.parentNode.appendChild(empty);
                   }
               } else {
                   target.parentNode.insertBefore(empty, target); //right to left
               }

               nodes = Array.from(target.parentNode.children);
               draggedIndex = nodes.indexOf(empty);
               console.log('draggedIndex after: ' + draggedIndex);
           });

            let $btnInput = $('#' + $.escapeSelector(btnInputName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $btnInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(btnInputName)).parent('.answer');

            input = new EditorInput($btnInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $expInput = $('#' + $.escapeSelector(expInputName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $expInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(expInputName)).parent('.answer');

            input = new EditorInput($expInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $saveButton = $('#' + $.escapeSelector('save'));
            let controls = new EditorControlList(controlsWrapper);
            $saveButton.on('click', event => {
                event.preventDefault();
                console.log("save");
                controls.add($btnInput, $expInput, input);

                //clear inputs
                $btnInput.parent('.answer').children('div').children('.mq-root-block').html('');
                $expInput.parent('.answer').children('div').children('.mq-root-block').html('');
            });
        }
    };
});
