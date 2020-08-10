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
        let nodes;
        let draggedIndex;
        let isSuccess = true;

        class EditorInput extends VisualMath.Input {

            constructor(input, parent) {
                super(input, parent);
                this.$textarea.on('blur', () => lastFocusedInput = this);
                this.$input.prop('required', true);
                this.$input.addClass('form-control');
                let errorDiv = document.createElement('div');
                $(errorDiv).addClass('invalid-feedback text-nowrap');
                this.$parent.append(errorDiv);
            }

            change() {
                super.onEdit = ($input, field) => {
                    $input.val(field.latex());
                    if (!isSuccess && !$input.parents('.test-box').length) {
                        if ($input.val() === '') {
                            $input.siblings('.visual-math-input-field')
                                .removeClass('form-control is-valid')
                                .addClass('form-control is-invalid');
                        } else {
                            $input.siblings('.visual-math-input-field')
                                .removeClass('form-control is-invalid')
                                .addClass('form-control is-valid');
                        }
                    }
                    $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
                };
            }

        }

        class EditorControl extends VisualMath.Control {

            constructor(name, text, onClick, command) {
                super(name, text, onClick);
                this.command = command;
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

                this.$element.attr('id', this.name);
                this.$element.attr('draggable', true);

                this.$element.on('dragstart', event => {
                    dragged = event.target;
                    nodes = Array.from(dragged.parentNode.children); //buttons on the control list
                    draggedIndex = nodes.indexOf(dragged);
                    // Add the target element's id to the data transfer object
                    event.originalEvent.dataTransfer.setData("text", event.target.id);
                    event.originalEvent.dataTransfer.dropEffect = "move";
                    event.target.style.opacity = 0.5;
                    $('.delete-box').removeClass('d-none');
                });

                this.$element.on('dragend', event => {
                    event.target.style.opacity = "";
                    $(':focus').blur();
                    if (document.getElementById('placeholder') !== null) {
                        document.getElementById('placeholder').replaceWith(dragged);
                    }
                    $('.delete-box').addClass('d-none');
                });

            }

        }

        class EditorControlList extends VisualMath.ControlList {

            constructor(wrapper) {
                super(wrapper);
            }

            /**
             * Add buttons to toolbar.
             *
             * @param buttonField
             * @param expressionField
             * @returns {boolean}
             */
            add(buttonField, expressionField) {
                let $buttonFieldRoot = $(buttonField.el());

                $(':focus').blur();

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
                    html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%;" id="${Date.now()}">`;
                    html += $html.prop('outerHTML');
                    html += '</div>';
                    $html = $(html);
                }

                html = $html.prop('outerHTML');

                this.addControl('btn_' + Date.now(), html, expressionField.latex());
                return true;
            }

            addAll(value) {
                let name = value['name'];
                let html = value['button'];
                let command = value['expression'];
                this.addControl(name, html, command);
            }

            addControl(name, html, command) {
                let control = new EditorControl(name, html, field => field.write(command), command);
                this.controls[name] = control;
                control.enable();
                this.$wrapper.append(control.$element);
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
            initialize: function (testInputId, btnInputId, expInputId, templateId, templateName,
                                  actionPath, managerPath) {

                // Mustache template context for editor page
                const context = {
                    "testInputLabel": "Test",
                    "inputSize": 30,
                    "inputBoxTitle": "Add Buttons",
                    "testBoxTitle": "Test Buttons/Save Template",
                    "buttonInputLabel": "Button",
                    "inputSpanClass": "answer",
                    "expressionInputLabel": "Expression",
                    "buttonClass": "btn btn-primary",
                    "addButtonValue": "Add",
                    "deleteIconClass": "fa fa-trash fa-2x",
                    "nameInputLabel": "Name",
                    "saveButtonValue": "Save",
                    "backButtonValue": "Go Back",
                    "toolbarTitle": "Toolbar",
                    "nameErrorMessage": "Name cannot be empty!"
                };

                let $btnInput;
                let $expInput;
                let $shortanswerInput; // Test input
                let $parent;
                let $testBox;
                let controlsWrapper;
                let target;

                let buttonInput;
                let expressionInput;
                let testInput;
                let controls;

                // To prevent calls to show test box repeatedly
                let isDataVisible = false;

                /**
                 * Shortmath input fields
                 */
                const initInputFields = () => {
                    $shortanswerInput = $('#' + $.escapeSelector(testInputId));
                    $btnInput = $('#' + $.escapeSelector(btnInputId));
                    $expInput = $('#' + $.escapeSelector(expInputId));

                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $shortanswerInput.removeClass('d-inline');
                    $parent = $shortanswerInput.parent('.answer');

                    testInput = new EditorInput($shortanswerInput, $parent);
                    testInput.$input.hide();
                    testInput.change();

                    if ($shortanswerInput.val()) {
                        testInput.field.write(
                            $shortanswerInput.val()
                        );
                    }

                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $btnInput.removeClass('d-inline');
                    $parent = $btnInput.parent('.answer');

                    buttonInput = new EditorInput($btnInput, $parent);
                    buttonInput.$input.hide();
                    buttonInput.change();

                    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
                    $expInput.removeClass('d-inline');
                    $parent = $expInput.parent('.answer');

                    expressionInput = new EditorInput($expInput, $parent);
                    expressionInput.$input.hide();
                    expressionInput.change();

                };

                /**
                 * Wrapper for toolbar and drag and drop functionality for buttons
                 */
                const initControlsWrapper = () => {
                    controlsWrapper = $('#' + $.escapeSelector(testInputId)).parents('.shortmath').find('.controls_wrapper');

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
                };

                /**
                 * To add buttons to toolbar in create mode/load buttons in edit mode
                 */
                const initAddForm = () => {
                    let $addButton = $('#' + $.escapeSelector('add'));
                    let $addForm = $('#' + $.escapeSelector('addForm'));
                    let buttonField = buttonInput.field;
                    let expressionField = expressionInput.field;

                    $testBox = $('.test-box');
                    controls = new EditorControlList(controlsWrapper);

                    buttonInput.$parent.find('.invalid-feedback').text('Button is empty or invalid!');
                    expressionInput.$parent.find('.invalid-feedback').text('Expression is empty or invalid!');

                    $addButton.click(event => {
                        event.preventDefault();

                        $addForm.submit();
                    });

                    $addForm.submit(event => {
                        if ($addForm[0].checkValidity() === false) {
                            isSuccess = false;

                            $(':focus').blur();

                            $addForm.find('input:text.form-control').each((index, element) => {
                                let $element = $(element);
                                if ($element.val() === '') {
                                    $element.siblings('.visual-math-input-field').addClass('form-control is-invalid');
                                }
                            });
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            isSuccess = controls.add(buttonField, expressionField);
                            if (isSuccess) {
                                if (!isDataVisible) {
                                    $testBox.show();
                                    isDataVisible = true;
                                }

                                $addForm.find('.visual-math-input-field').removeClass('form-control is-valid');

                                //clear inputs
                                buttonField.latex('');
                                expressionField.latex('');
                            }
                            event.preventDefault();
                        }
                    });

                    if (templateId === 0) {
                        $testBox.hide();
                    } else {
                        $.post(actionPath,
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
                };

                /**
                 * To delete buttons from toolbar
                 */
                const initDeleteButton = () => {
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
                };

                /**
                 * To save toolbar template in database
                 */
                const initSaveForm = () => {
                    let $saveButton = $('#' + $.escapeSelector('save'));
                    let $templateNameInput = $('#' + $.escapeSelector('name'));
                    let $saveForm = $('#' + $.escapeSelector('saveForm'));

                    $templateNameInput.val(templateName)
                        .on('blur', () => {
                            lastFocusedInput = $templateNameInput;
                        });

                    $saveForm.submit(event => {
                        if ($saveForm[0].checkValidity() === false) {
                            $(':focus').blur();
                            $saveForm.addClass('was-validated');
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            let data = [];
                            let items = controls.controls;

                            controlsWrapper.children('button').each((index, element) => {
                                let control = items[element.id];
                                data.push({
                                    name: control['name'],
                                    button: control['text'],
                                    expression: control['command']
                                });
                            });

                            $.post(actionPath,
                                {
                                    'data': JSON.stringify(data),
                                    'name': $templateNameInput.val().trim(),
                                    'id': templateId
                                }
                            ).done(message => {
                                if (message > 0) {
                                    if (templateId > 0) {
                                        notification.addNotification({
                                            message: "Configuration saved! Please wait...",
                                            type: "success"
                                        });

                                        $('#' + $.escapeSelector('overlay-div')).show();

                                        setTimeout(() => {
                                            window.location.replace(managerPath);
                                        }, 5000);
                                    } else {
                                        notification.addNotification({
                                            message: "Configuration saved!",
                                            type: "success"
                                        });

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
                            $saveForm.removeClass('was-validated');
                            event.preventDefault();
                        }
                    });

                    $saveButton.on('click', event => {
                        event.preventDefault();

                        // Clear notifications
                        $('.alert').alert('close');
                        $saveForm.submit();
                    });
                };

                /**
                 * To add back button to editor page
                 */
                const initBackButton = () => {
                    let $backButton = $('#' + $.escapeSelector('back'));
                    $backButton.on('click', event => {
                        event.preventDefault();
                        window.location.replace(managerPath);
                    });
                };

                Templates.render('qtype_shortmath/editor', context).then(
                    (html, js) => {
                        Templates.appendNodeContents('div[role=\'main\']', html, js);
                        initInputFields();
                        initControlsWrapper();
                        initAddForm();
                        initDeleteButton();
                        initSaveForm();
                        initBackButton();
                    }).fail(function (ex) {
                    // Deal with this exception (I recommend core/notify exception function for this).
                });
            }
        };
    });
