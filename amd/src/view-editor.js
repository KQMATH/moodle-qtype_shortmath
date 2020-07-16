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
define(['jquery', 'qtype_shortmath/visual-math-input', 'core/templates'], function ($, VisualMath, Templates) {
    let lastFocusedInput = null;
    let dragged;
    let target;
    let nodes;
    let draggedIndex;

    class EditorInput extends VisualMath.Input {

        constructor(input, parent) {
            super(input, parent);
            this.$textarea.on('blur', () => lastFocusedInput = this);
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
                $(':focus').blur();
                if (lastFocusedInput !== null) {
                    if (lastFocusedInput.field === undefined) {
                        console.log('Plain text field');
                        lastFocusedInput.focus();
                        return;
                    }
                    this.onClick(lastFocusedInput.field);
                    lastFocusedInput.field.focus();
                }
            });

            this.$element.attr('id', new Date().getTime());
            this.$element.attr('draggable', true);
            this.$element.css({width: 'auto', height: 'auto'});

            this.$element.on('dragstart', event => {
                dragged = event.target;
                nodes = Array.from(dragged.parentNode.children); //buttons on the control list
                draggedIndex = nodes.indexOf(dragged);
                // Add the target element's id to the data transfer object
                event.originalEvent.dataTransfer.setData("text", event.target.id);
                event.originalEvent.dataTransfer.dropEffect = "move";
                event.target.style.opacity = 0.5;
                $('.delete-icon').show();
            });

            this.$element.on('dragend', event => {
                event.target.style.opacity = "";
                $(':focus').blur();
                if (document.getElementById('placeholder') !== null) {
                    document.getElementById('placeholder').replaceWith(dragged);
                }
                $('.delete-icon').hide();
            });

        }

    }

    class EditorControlList {

        constructor(wrapper) {
            this.controls = [];
            this.$wrapper = $(wrapper);
            this.$wrapper.addClass('visual-math-input-wrapper');
            // this.defineDefault();
        }

        add($btnInput, $expInput, expEditorInput) {
            $(':focus').blur();
            if ($btnInput.val() === '' || $expInput.val() === '') {
                console.log('Enter all values!');
                return false;
            }

            let control;
            let html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%; id=${new Date().getTime()}">`;
            html += '<span class="mq-root-block">';
            html += $btnInput.parent('.answer').children('div').children('.mq-root-block').html();
            html += '</span></div>';

            let command = expEditorInput.field.latex();

            control = new EditorControl(html, field => field.write(command));
            control.enable();
            this.$wrapper.append(control.$element);
            this.controls.push({button: html, expression: command});
            return true;
        }

        addAll(value) {
            let html = value['button'];
            let command = value['expression'];
            let control = new EditorControl(html, field => field.write(command));
            control.enable();
            this.$wrapper.append(control.$element);
            this.controls.push({button: html, expression: command});
        }

    }

    return {
        initialize: function (testInputId, btnInputId, expInputId, data) {

            const context = {
                "shortMathClass": "que shortmath",
                "controlsWrapperClass": "controls_wrapper",
                "messageClass": "message",
                "messageValue": "Configuration saved!",
                "testInputLabel": "Test:",
                "testInputId": "test",
                "testInputName": "test",
                "testInputSize": 30,
                "buttonInputId": "btn",
                "buttonInputLabel": "Button:",
                "inputDivClass": "ablock form-inline",
                "inputSpanClass": "answer",
                "buttonInputName": "btn",
                "buttonInputSize": 30,
                "expressionInputId": "exp",
                "expressionInputLabel": "Expression:",
                "expressionInputName": "exp",
                "expressionInputSize": 30,
                "addButtonName": "add",
                "addButtonId": "add",
                "addButtonClass": "btn btn-primary",
                "addButtonValue": "Add",
                "deleteIconClass": "fa fa-trash fa-2x",
                "nameInputLabel": "Name:",
                "nameInputClass": "form-control",
                "nameInputName": "name",
                "nameInputId": "name",
                "saveButtonName": "save",
                "saveButtonId": "save",
                "saveButtonClass": "btn btn-primary",
                "saveButtonValue": "Save",
                "backButtonName": "back",
                "backButtonId": "back",
                "backButtonClass": "btn btn-primary",
                "backButtonValue": "Go Back"
            };

            Templates.render('qtype_shortmath/editor', context)
                .then(function (html, js) {
                    Templates.appendNodeContents('div[role=\'main\']', html, js);

                    var $shortanswerInput = $('#' + $.escapeSelector(testInputId));
                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $shortanswerInput.removeClass('d-inline');
                    var $parent = $('#' + $.escapeSelector(testInputId)).parent('.answer');

                    var testInput = new EditorInput($shortanswerInput, $parent);
                    testInput.$input.hide();
                    testInput.change();

                    if ($shortanswerInput.val()) {
                        testInput.field.write(
                            $shortanswerInput.val()
                        );
                    }

                    var controlsWrapper = $('#' + $.escapeSelector(testInputId)).parents('.shortmath').find('.controls_wrapper');

                    controlsWrapper.addClass('visual-math-input-wrapper');
                    controlsWrapper.attr('id', 'target');

                    controlsWrapper.on('drop', event => {
                        event.preventDefault();

                        if (target.id === dragged.id) {
                            event.originalEvent.dataTransfer.clearData();
                            return;
                        }

                        document.getElementById('placeholder').replaceWith(dragged);
                        event.originalEvent.dataTransfer.clearData();
                    });

                    controlsWrapper.on('dragover', event => {
                        event.preventDefault();
                        event.originalEvent.dataTransfer.dropEffect = "move";
                    });

                    controlsWrapper.on('dragenter', event => {

                        let targetId;
                        if ($(event.target).hasClass('visual-math-input-wrapper')) {
                            targetId = event.target.lastChild.id;
                        } else if (event.target.nodeName !== 'BUTTON') {
                            targetId = $(event.target).parents('button').attr('id');
                        } else {
                            targetId = event.target.id;
                        }

                        if (targetId === 'placeholder') {
                            return;
                        }

                        target = document.getElementById(targetId);

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

                        if (target.parentNode.contains(dragged)) {
                            target.parentNode.removeChild(dragged);
                        } else {
                            target.parentNode.removeChild(document.getElementById('placeholder'));
                        }

                        if (draggedIndex < targetIndex) {
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
                    });

                    let $btnInput = $('#' + $.escapeSelector(btnInputId));
                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $btnInput.removeClass('d-inline');
                    $parent = $('#' + $.escapeSelector(btnInputId)).parent('.answer');

                    let buttonInput = new EditorInput($btnInput, $parent);
                    buttonInput.$input.hide();
                    buttonInput.change();

                    let $expInput = $('#' + $.escapeSelector(expInputId));
                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $expInput.removeClass('d-inline');
                    $parent = $('#' + $.escapeSelector(expInputId)).parent('.answer');

                    let expressionInput = new EditorInput($expInput, $parent);
                    expressionInput.$input.hide();
                    expressionInput.change();

                    let $saveButton = $('#' + $.escapeSelector('save'));

                    let $saveModeDiv = $('#' + $.escapeSelector('saveMode'));

                    let $testModeDiv = $('.test');

                    let $testMode = $('#' + $.escapeSelector('testMode'));
                    $testMode.change(() => {
                        if ($testMode.prop('checked')) {
                            $saveModeDiv.hide();
                            $testModeDiv.show();
                        } else {
                            $saveModeDiv.show();
                            $testModeDiv.hide();
                        }
                    });

                    let $modeCheckDiv = $('.modeCheck');

                    let $testBox = $('.box-1');

                    // To prevent calls to show test box repeatedly
                    let isDataVisible = false;

                    let $addButton = $('#' + $.escapeSelector('add'));
                    let controls = new EditorControlList(controlsWrapper);

                    $addButton.on('click', event => {
                        event.preventDefault();

                        let isSuccess = controls.add($btnInput, $expInput, expressionInput);
                        if (isSuccess && !isDataVisible) {
                            $modeCheckDiv.show();
                            $testBox.show();
                            if ($testMode.prop('checked')) {
                                $saveModeDiv.hide();
                                $testModeDiv.show();
                            } else {
                                $saveModeDiv.show();
                                $testModeDiv.hide();
                            }
                            isDataVisible = true;
                        }

                        //clear inputs
                        $btnInput.parent('.answer').children('div').children('.mq-root-block').html('');
                        $expInput.parent('.answer').children('div').children('.mq-root-block').html('');

                        buttonInput.field.latex('');
                        expressionInput.field.latex('');

                    });

                    let name = '';
                    if (data === null) {
                        $testBox.hide();
                    } else {
                        name = data['name'];
                        if ($testMode.prop('checked')) {
                            $saveModeDiv.hide();
                            $testModeDiv.show();
                        } else {
                            $saveModeDiv.show();
                            $testModeDiv.hide();
                        }
                        isDataVisible = true;
                        JSON.parse(data['template']).forEach(controls.addAll.bind(controls));
                    }

                    let $templateNameInput = $('#' + $.escapeSelector('name'));
                    $templateNameInput.val(name);
                    $templateNameInput.on('blur', () => {
                        lastFocusedInput = $templateNameInput;
                    });

                    $saveButton.on('click', event => {
                        $(':focus').blur();
                        $.ajax({
                            method: 'post',
                            url: 'editor_action.php',
                            data: {
                                'data': JSON.stringify(controls.controls),
                                'name': $templateNameInput.val(),
                                'id': data === null ? 0 : data['id']
                            }
                        }).done(message => {
                            if (message > 0) {
                                controlsWrapper.html('');
                                controls = new EditorControlList(controlsWrapper);
                                $templateNameInput.val('');
                                testInput.field.latex('');
                                $testMode.prop('checked', false);
                                $saveModeDiv.hide();
                                $modeCheckDiv.hide();
                                let messageDiv = $('#' + $.escapeSelector(testInputId)).parents('.shortmath').find('.message');
                                messageDiv.show();
                                setTimeout(() => {
                                    messageDiv.hide();
                                    $testBox.hide();
                                    isDataVisible = false;
                                    if (data !== null) {
                                        window.location.replace('/question/type/shortmath/editor_manager.php');
                                    }
                                }, 5000);
                            }
                        }).fail((jqXHR, textStatus, errorThrown) => {
                            console.log('error: ' + errorThrown);
                            alert(textStatus);
                        });
                    });

                    let deleteIcon = $('.delete-icon');

                    deleteIcon.on('dragover', event => {
                        event.preventDefault();
                        event.originalEvent.dataTransfer.dropEffect = "move";
                    });

                    deleteIcon.on('drop', event => {
                        event.preventDefault();
                        let parentNode = dragged.parentNode;
                        if (parentNode !== null) {
                            parentNode.removeChild(dragged);
                            if (parentNode.firstElementChild === null) {
                                $templateNameInput.val('');
                                testInput.field.latex('');
                                $testMode.prop('checked', false);
                                $testBox.hide();
                                isDataVisible = false;
                            }
                        } else {
                            let placeholder = document.getElementById('placeholder');
                            if (placeholder !== null) {
                                placeholder.parentNode.removeChild(placeholder);
                            }
                        }
                        event.originalEvent.dataTransfer.clearData();
                    });

                    let $backButton = $('#' + $.escapeSelector('back'));
                    $backButton.on('click', event => {
                        event.preventDefault();
                        window.location.replace('/question/type/shortmath/editor_manager.php');
                    });

                }).fail(function (ex) {
                // Deal with this exception (I recommend core/notify exception function for this).
            });
        }
    };
});
