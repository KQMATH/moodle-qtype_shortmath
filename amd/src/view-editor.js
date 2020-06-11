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
    /*return {
        initialize: function(inputname, readonly) {
            console.log("ADD CONTENTS HERE!!");
        }
    };*/
    class EditorInput extends VisualMath.Input {
        change(input) {
            input.onEdit = ($input, field) => {
                console.log("changed ");
                $input.val(field.latex());
                $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
            };
        }

        save($btnInput, $expInput, controlsWrapper) {
            let btnText = $btnInput.val().replace(/[{}\s]/g, '');
            let expText = $expInput.val().replace(/[{}\s]/g, '');
            console.log(btnText);
            console.log(expText);
            let control;
            let caret = '';
            let chars;
            if(expText.replace(/[{}a-z0-9A-Z\s]/g, '') === '^'){
                let chars = btnText.split('^');
                console.log(chars[0]+' '+chars[1]);
                caret += '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
                caret += '<span class="mq-root-block">';
                caret += '<var>${chars[0]}</var>';
                caret += '<span class="mq-supsub mq-non-leaf mq-sup-only">';
                caret += '<span class="mq-sup">';
                caret += '<var>${chars[1]}</var>';
                caret += '</span></span></span></div>';
            }
            else if(expText.includes('lim_')){
                let lim = '<span class="mq-root-block">lim</span>';
                console.log('lim');
                let chars = expText.split('\\');
                console.log(chars);
                control = new VisualMath.Control('lim', lim, field => {
                    field.cmd('\\lim').typedText('_').write(chars[1].split('_')[1])
                        .cmd('\\to').write(expText.split('to')[1]).moveToRightEnd();
                });
            }
            /*control = new VisualMath.Control('caret', caret, field => field.cmd('^'));*/
            control.enable();
            controlsWrapper.append(control.$element);

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

            var input = new VisualMath.Input($shortanswerInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();

            let editorInput = new EditorInput();
            if (!readonly) {
                /*input.onEdit = function($input, field) {
                    console.log("changed ");
                    $input.val(field.latex());
                    $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
                };*/

                editorInput.change(input);

            } else {
                readOnly = true;
                input.disable();
            }

            if ($shortanswerInput.val()) {
                input.field.write(
                    $shortanswerInput.val()
                );
            }

            // if (!readOnly) {
                var controlsWrapper = $('#' + $.escapeSelector(inputName)).parents('.shortmath').find('.controls_wrapper');
                var controls = new VisualMath.ControlList(controlsWrapper);
                controls.enableAll();
            // }
            // let controlsWrapper = $('#' + $.escapeSelector(inputName)).parents('.shortmath').find('.controls_wrapper');

            let $btnInput = $('#' + $.escapeSelector(btnName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $btnInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(btnName)).parent('.answer');

            input = new VisualMath.Input($btnInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            editorInput.change(input);

            let $expInput = $('#' + $.escapeSelector(expName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $expInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(expName)).parent('.answer');

            input = new VisualMath.Input($expInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            editorInput.change(input);

            let $saveButton = $('#' + $.escapeSelector('save'));
            $saveButton.on('click', event => {
                event.preventDefault();
                /*if (lastFocusedInput !== null) {
                    this.onClick(lastFocusedInput.field);
                    lastFocusedInput.field.focus();
                }*/
                console.log("save");
                //console.log($expInput.val().replace(/[{}a-z0-9A-Z\s]/g, ''));
                editorInput.save($btnInput, $expInput, controlsWrapper);
            });
        }
    };
});
