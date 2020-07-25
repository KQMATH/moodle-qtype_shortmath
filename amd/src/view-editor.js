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
define(['jquery', 'qtype_shortmath/visual-math-input', 'core/templates', 'core/notification', 'theme_boost/popover'],
    function ($, VisualMath, Templates, notification) {
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

                this.$element.on('dragstart', event => {
                    dragged = event.target;
                    nodes = Array.from(dragged.parentNode.children); //buttons on the control list
                    draggedIndex = nodes.indexOf(dragged);
                    // Add the target element's id to the data transfer object
                    event.originalEvent.dataTransfer.setData("text", event.target.id);
                    event.originalEvent.dataTransfer.dropEffect = "move";
                    event.target.style.opacity = 0.5;
                    $('.delete-icon').removeClass('d-none');
                });

                this.$element.on('dragend', event => {
                    event.target.style.opacity = "";
                    $(':focus').blur();
                    if (document.getElementById('placeholder') !== null) {
                        document.getElementById('placeholder').replaceWith(dragged);
                    }
                    $('.delete-icon').addClass('d-none');
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

            /**
             *
             * @param buttonField
             * @param expressionField
             * @param $inputFields
             * @returns {boolean}
             */
            add(buttonField, expressionField, $inputFields) {
                let $buttonFieldRoot = $(buttonField.el());
                let $expressionFieldRoot = $(expressionField.el());
                let expressionValue = expressionField.latex();
                let showMessage = false;

                $(':focus').blur();

                if (buttonField.latex() === '') {
                    $expressionFieldRoot.parent().attr('data-content', '');
                    showMessage = true;
                    buttonField.focus();
                    $buttonFieldRoot.parent().attr('data-content', 'Button cannot be blank!');
                } else if (expressionValue === '') {
                    $buttonFieldRoot.parent().attr('data-content', '');
                    showMessage = true;
                    expressionField.focus();
                    $expressionFieldRoot.parent().attr('data-content', 'Expression cannot be blank!');
                }

                if (showMessage) {
                    console.log('Enter all values!');
                    $inputFields.popover('enable');
                    $inputFields.popover('show');
                    return false;
                } else {
                    $inputFields.popover('disable');
                }

                let html = $buttonFieldRoot.find('.mq-root-block').prop('outerHTML');

                let $html = $(html);

                $html.find('.mq-empty').remove(); // Removes white space from buttons

                $html.find('big').replaceWith((i, element) => {
                    return '<span>' + element + '</span>';
                });

                let $frac = $html.find('.mq-fraction'); //division
                if ($frac.length > 0) {
                    $html.append('<var>' + $html.find('.mq-numerator').text()
                        + '/' + $html.find('.mq-denominator').text() + '</var>');
                    $frac.remove();
                }

                let $binom = $html.find('.mq-paren.mq-scaled'); //nCr
                let $supsub = $html.find('.mq-supsub'); //power
                let $vars = $html.find('var');

                if ($binom.length > 0 || $supsub.length > 0 || $vars.length > 0) {
                    if ($binom.length > 0) {
                        $binom.css('transform', 'scale(0.8, 1.5)'); //resize binomial
                        $html.find('.mq-array.mq-non-leaf').parent().addClass('mt-0');
                        $html.find('var').parent().css('font-size', '14px');
                    }
                    html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%;" id="${new Date().getTime()}">`;
                    html += $html.prop('outerHTML');
                    html += '</div>';
                    $html = $(html);
                }

                html = $html.prop('outerHTML');

                this.addControl(html, expressionValue);
                return true;
            }

            addAll(value) {
                let html = value['button'];
                let command = value['expression'];
                this.addControl(html, command)
            }

            addControl(html, command) {
                let control = new EditorControl(html, field => field.write(command));
                control.enable();
                this.$wrapper.append(control.$element);
                this.controls.push({button: html, expression: command});
            }

        }

        return {
            /**
             *
             * @param testInputId
             * @param btnInputId
             * @param expInputId
             * @param templateId
             * @param templateName
             * @param testInputId
             */
            initialize: function (testInputId, btnInputId, expInputId, templateId, templateName) {

                const context = {
                    "testInputLabel": "Test:",
                    "inputSize": 30,
                    "inputBoxTitle": "Add Buttons",
                    "testBoxTitle": "Test Buttons/Save Template",
                    "buttonInputLabel": "Button:",
                    "inputSpanClass": "answer",
                    "expressionInputLabel": "Expression:",
                    "buttonClass": "btn btn-primary",
                    "addButtonValue": "Add",
                    "deleteIconClass": "fa fa-trash fa-2x",
                    "nameInputLabel": "Name:",
                    "saveButtonValue": "Save",
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

                        let $testBox = $('.test-box');

                        // To prevent calls to show test box repeatedly
                        let isDataVisible = false;

                        let $addButton = $('#' + $.escapeSelector('add'));
                        let controls = new EditorControlList(controlsWrapper);

                        let buttonField = buttonInput.field;
                        let expressionField = expressionInput.field;
                        let $inputFields = $('.answer[data-toggle="popover"]');

                        $addButton.on('click', event => {
                            event.preventDefault();

                            let isSuccess = controls.add(buttonField, expressionField, $inputFields);
                            if (isSuccess) {
                                if (!isDataVisible) {
                                    $testBox.show();
                                    isDataVisible = true;
                                }

                                //clear inputs
                                buttonField.latex('');
                                expressionField.latex('');
                            }

                        });

                        if (templateId === 0) {
                            $testBox.hide();
                        } else {
                            $.post(M.str.qtype_shortmath.editor_action_path,
                                {
                                    'id': templateId,
                                    'type': 'get'
                                }
                            ).done(message => {
                                let data = JSON.parse(message);
                                isDataVisible = true;
                                JSON.parse(data['template']).forEach(controls.addAll.bind(controls));
                            }).fail((jqXHR, textStatus, errorThrown) => {
                                notification.addNotification({
                                    message: textStatus + ': ' + errorThrown,
                                    type: "error"
                                });
                            });
                        }

                        let $templateNameInput = $('#' + $.escapeSelector('name'));
                        $templateNameInput.val(templateName)
                            .on('blur', () => {
                                lastFocusedInput = $templateNameInput;
                            });

                        $saveButton.on('click', event => {
                            event.preventDefault();

                            // Clear notifications
                            $('.alert').alert('close');

                            let name = $templateNameInput.val().trim();
                            if (name === '') {
                                $templateNameInput.focus()
                                    .popover('enable')
                                    .popover('show');
                                return;
                            } else {
                                $templateNameInput.popover('disable');
                            }

                            $.post(M.str.qtype_shortmath.editor_action_path,
                                {
                                    'data': JSON.stringify(controls.controls),
                                    'name': name,
                                    'id': templateId
                                }
                            ).done(message => {
                                if (message > 0) {
                                    notification.addNotification({
                                        message: "Configuration saved!",
                                        type: "success"
                                    });
                                    if (templateId > 0) {
                                        $('#' + $.escapeSelector('overlay-div')).show();
                                        setTimeout(() => {
                                            window.location.replace(M.str.qtype_shortmath.editor_manager_path);
                                        }, 5000);
                                    } else {
                                        controlsWrapper.html('');
                                        controls = new EditorControlList(controlsWrapper);
                                        $templateNameInput.val('');
                                        testInput.field.latex('');
                                        $testBox.hide();
                                        isDataVisible = false;
                                    }
                                } else {
                                    notification.addNotification({
                                        message: "Something went wrong!",
                                        type: "error"
                                    });
                                }
                                $saveButton.blur();
                            }).fail((jqXHR, textStatus, errorThrown) => {
                                notification.addNotification({
                                    message: textStatus + ': ' + errorThrown,
                                    type: "error"
                                });
                                $saveButton.blur();
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
                                    testInput.field.latex('');
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
                            window.location.replace(M.str.qtype_shortmath.editor_manager_path);
                        });

                        //field validation messages
                        $inputFields.each((index, element) => {
                            $(element).popover({
                                container: element,
                                placement: 'top',
                                trigger: 'manual'
                            });
                        });

                        $templateNameInput.popover({
                            placement: 'top',
                            trigger: 'manual',
                            content: 'Name cannot be empty!'
                        });

                    }).fail(function (ex) {
                    // Deal with this exception (I recommend core/notify exception function for this).
                });
            }
        };
    });
