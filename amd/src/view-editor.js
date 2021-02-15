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
import VisualMath from "???";
import Templates from "???";
import notification from "???";
/**
 * @module qtype_shortmath/input
 */

let lastFocusedInput = null;
let dragged;
let nodes;
let draggedIndex;
let isSuccess = true;

class EditorInput extends VisualMath.Input {

    constructor(input, parent) {
        super(input, parent);
        // $textarea doesn't even exist?
        this.$textarea.addEventListener("focusout", () => {
            lastFocusedInput = this;
        });
        this.$input.setAttribute("required", true);
        this.$input.classList.add("form-control");
        let errorDiv = document.createElement('div');
        errorDiv.classList.add("invalid-feedback text-nowrap");
        this.$parent.appendChild(errorDiv);
    }

    change() {
        super.onEdit = (inputElement, field) => {
            inputElement.value = field.latex();
            if (!isSuccess && inputElement.closest('.test-box') !== null) {
                if (inputElement.value.length === 0) {
                    inputElement.parentElement.children.forEach(element => {
                        element.classList.remove("form-control is-valid")
                        element.classList.add("form-control is-invalid")
                    });
                } else {
                    inputElement.parentElement.children.forEach(element => {
                        element.classList.remove("form-control is-invalid")
                        element.classList.add("form-control is-valid")
                    });
                }
            }
            inputElement.dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
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

        this.$element.removeEventListener("click");
        this.$element.addEventListener("click", event => {
            event.preventDefault();

            document.querySelector(":focus").blur();


            if (lastFocusedInput !== null) {
                if (lastFocusedInput.field === undefined) {
                    // For plain text field.
                    lastFocusedInput.focus();
                    return;
                }
                this.onClick(lastFocusedInput.field);
                lastFocusedInput.field.focus();
            }
        });

        this.$element.id = this.name;
        this.$element.setAttribute('draggable', true);

        this.$element.addEventListener("dragstart", event => {
            dragged = event.target;
            nodes = Array.from(dragged.parentNode.children); //buttons on the control list
            draggedIndex = nodes.indexOf(dragged);
            // Add the target element's id to the data transfer object
            event.dataTransfer.setData("text", event.target.id);
            event.dataTransfer.dropEffect = "move";
            event.target.style.opacity = 0.5;
            document.querySelector(".delete-box").classList.remove("d-none");
        });

        this.$element.addEventListener('dragend', event => {
            event.target.style.opacity = "";
            document.querySelector(":focus").blur();
            if (document.getElementById('placeholder') !== null) {
                document.getElementById('placeholder').replaceWith(dragged);
            }
            document.querySelector(".delete-box").classList.add("d-none");
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

        document.querySelector(":focus").blur();

        
        // TODO: Why get the outerHTML?
        let html = buttonField.querySelector('.mq-root-block').outerHTML;
        const $html = DOMParser.prototype.parseFromString(html);

        let $empty = $html.querySelector('.mq-empty');
        if ($empty.closest('.mq-int') !== null && $empty !== null) {
            // TODO: Quite verbose. Maybe make a function for it?
            $empty.closest('.mq-supsub').parentElement.removeChild($empty.closest('.mq-supsub')); // Removes super/subscript white space in buttons.
        }
        $empty.parentElement.removeChild($empty); // Removes white space from buttons.

        const span = document.createElement("span");
        span.appendChild()
        $html.querySelector('big').replaceWith((i, element) => {
            return '<span>' + element + '</span>';
        });

        let $frac = $html.querySelector('.mq-fraction'); // Division symbol.
        if ($frac.length > 0) {
            $html.append('<var>' + $html.querySelector('.mq-numerator').text() + '</var>' +
                '<span>/</span><var>' + $html.querySelector('.mq-denominator').text() + '</var>');
            $frac.remove();
        }

        let $binom = $html.querySelector('.mq-paren.mq-scaled'); // Binomial symbol.
        let $supsub = $html.querySelector('.mq-supsub'); // Power symbol.
        let $vars = $html.querySelector('var');

        if ($binom.length > 0 || $supsub.length > 0 || $vars.length > 0) {
            if ($binom.length > 0) {
                $binom.css('transform', 'scale(0.8, 1.5)'); // Resize binomial.
                $html.querySelector('.mq-array.mq-non-leaf').parentElement.classList.add('mt-0');
                $html.querySelector('var').parentElement.style.fontSize = '14px';
            }
            html = `<div class="mq-math-mode" style="cursor:pointer;font-size:100%;" id="${Date.now()}">`;
            html += $html.outerHTML;
            html += '</div>';
            $html = DOMParser.prototype.parseFromString(html);
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

export const initialize = (testInputId, btnInputId, expInputId, templateId, templateName, actionPath, managerPath) => {
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
    let buttonField;
    let expressionField;
    let testField;
    let controls;

    // To prevent calls to show test box repeatedly
    let isDataVisible = false;

    /**
     * Shortmath input fields
     */
    const initInputFields = () => {

        $shortanswerInput = document.querySelector(`#${testInputId}`);
        $btnInput = document.querySelector(`#${btnInputId}`);
        $btnInput = document.querySelector(`#${expInputId}`);
        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        $shortanswerInput.classList.remove('d-inline');
        $parent = $shortanswerInput.closest('.answer');

        testInput = new EditorInput($shortanswerInput, $parent);
        // TODO: visibility hidden, or display none?
        testInput.$input.style.visibility = "hidden";
        testInput.change();
        testField = testInput.field;

        if ($shortanswerInput.value) {
            testField.write(
                $shortanswerInput.val()
            );
        }

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        $btnInput.classList.remove('d-inline');
        $parent = $btnInput.closest('.answer');

        buttonInput = new EditorInput($btnInput, $parent);
        // TODO: display none or visibility hidden?
        buttonInput.$input.style.visibility = "hidden";
        buttonInput.change();
        buttonField = buttonInput.field;

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        $expInput.classList.remove('d-inline');
        $parent = $expInput.closest('.answer');

        expressionInput = new EditorInput($expInput, $parent);
        // TODO: display none or visibility hidden?
        expressionInput.$input.style.visibility = "hidden";
        expressionInput.change();
        expressionField = expressionInput.field;

    };

    /**
     * Wrapper for toolbar and drag and drop functionality for buttons
     */
    const initControlsWrapper = () => {

        // TODO: Do we REALLY have to traverse like this? Can't we just
        // go directly to the controls_wrapper?
        controlsWrapper = document.querySelector(`#${testInputId}`).closest(".shortmath").querySelector(".controls_wrapper");
        // controlsWrapper = $('#' + $.escapeSelector(testInputId)).parents('.shortmath').find('.controls_wrapper');

        controlsWrapper.classList.add('visual-math-input-wrapper');
        controlsWrapper.id = "target";

        controlsWrapper.addEventListener("drop", event => {
            event.preventDefault();

            if (target.id === dragged.id) {
                event.dataTransfer.clearData();
                return;
            }

            document.getElementById('placeholder').replaceWith(dragged);
            event.dataTransfer.clearData();
        });

        controlsWrapper.addEventListener('drop', event => {
            event.preventDefault();

            if (target.id === dragged.id) {
                event.dataTransfer.clearData();
                return;
            }

            document.getElementById('placeholder').replaceWith(dragged);
            event.dataTransfer.clearData();
        });

        controlsWrapper.addEventListener('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        controlsWrapper.addEventListener('dragenter', event => {

            let targetId;
            if (event.target.classList.includes('visual-math-input-wrapper')) {
                targetId = event.target.lastChild.id;
            } else if (event.target.nodeName !== 'BUTTON') {
                targetId = event.target.closest("button").id;
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
            empty.id = 'placeholder';
            empty.classList.add('visual-math-input-control btn btn-primary');
            empty.setAttribute('draggable', true);
            empty.style.border = '2px solid red';

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
        let $addButton = document.querySelector("#addForm");
        let $addForm = document.querySelector("#add");

        $testBox = document.querySelector(".test-box");
        controls = new EditorControlList(controlsWrapper);

        buttonInput.$parent.querySelector('.invalid-feedback').textContent = 'Button is empty or invalid!';
        expressionInput.$parent.querySelector('.invalid-feedback').textContent = 'Expression is empty or invalid!';

        $addButton.addEventListener("click", event => {
            event.preventDefault();

            $addForm.submit();
        });

        $addForm.submit(event => {
            if ($addForm[0].checkValidity() === false) {
                isSuccess = false;

                document.querySelector(":focus").blur();

                $addForm.querySelectorAll('input:text.form-control').forEach(element => {
                    if (element.value.length === 0) {
                        // TODO: I don't understand the original intent. Look at original
                        // code to see context.
                        element.siblings('.visual-math-input-field').classList.add('form-control is-invalid');
                    }
                });
                event.preventDefault();
                event.stopPropagation();
            } else {
                isSuccess = controls.add(buttonField, expressionField);
                if (isSuccess) {
                    if (!isDataVisible) {
                        // TODO: display block or visibility visible?
                        $testBox.style.visibility = "visible"
                        isDataVisible = true;
                    }

                    $addForm.querySelector('.visual-math-input-field').classList.remove('form-control is-valid');

                    //clear inputs
                    buttonField.latex('');
                    expressionField.latex('');
                }
                event.preventDefault();
            }
        });

        if (templateId === 0) {
            // TODO: display none or visibility hidden?
            $testBox.style.visibility = "hidden";
        } else {
            // TODO: Figure out core/ajax

            // $.post(actionPath,
            //     {
            //         'id': templateId,
            //         'type': 'get'
            //     }
            // ).done(message => {
            //     let data = JSON.parse(message);
            //     isDataVisible = true;
            //     JSON.parse(data['template']).forEach(controls.addAll.bind(controls));
            // }).fail((jqXHR, textStatus, errorThrown) => {
            //     notification.addNotification({
            //         message: textStatus + ': ' + errorThrown,
            //         type: "error"
            //     });
            // });
        }
    };

    /**
     * To delete buttons from toolbar
     */
    const initDeleteButton = () => {
        let deleteIcon = document.querySelector(".delete-icon");

        deleteIcon.addEventListener('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        deleteIcon.addEventListener('drop', event => {
            event.preventDefault();
            let parentNode = dragged.parentNode;
            if (parentNode !== null) {
                parentNode.removeChild(dragged);
                if (parentNode.firstElementChild === null) {
                    testField.latex('');
                    // TODO: display none or visibility hidden?
                    $testBox.style.visibility = "hidden";
                    isDataVisible = false;
                }
            } else {
                let placeholder = document.getElementById('placeholder');
                if (placeholder !== null) {
                    placeholder.parentNode.removeChild(placeholder);
                }
            }
            event.dataTransfer.clearData();
        });
    };

    /**
     * To save toolbar template in database
     */
    const initSaveForm = () => {
        const $saveButton = document.querySelector('#save');
        const $templateNameInput = document.querySelector('#name');
        const $saveForm = document.querySelector('#saveForm');

        $templateNameInput.addEventListener('blur', () => {
                lastFocusedInput = $templateNameInput;
            });

        $saveForm.submit(event => {
            if ($saveForm[0].checkValidity() === false) {
                document.querySelector(":focus").blur();
                $saveForm.classList.add('was-validated');
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

                // $.post(actionPath,
                //     {
                //         'data': JSON.stringify(data),
                //         'name': $templateNameInput.val().trim(),
                //         'id': templateId
                //     }
                // ).done(message => {
                //     if (message > 0) {
                //         if (templateId > 0) {
                //             notification.addNotification({
                //                 message: "Configuration saved! Please wait...",
                //                 type: "success"
                //             });

                //             // TODO: display: block; or visibility: visible; ?
                //             document.querySelector("overlay-div").style.display = "block";

                //             setTimeout(() => {
                //                 window.location.replace(managerPath);
                //             }, 5000);
                //         } else {
                //             notification.addNotification({
                //                 message: "Configuration saved!",
                //                 type: "success"
                //             });

                //             controlsWrapper.html('');
                //             controls = new EditorControlList(controlsWrapper);
                //             $templateNameInput.val('');
                //             testField.latex('');
                //             buttonField.latex('');
                //             expressionField.latex('');
                //             // TODO: display none or visibility hidden?
                //             $testBox.style.visibility = "hidden";
                //             isDataVisible = false;
                //         }
                //     } else {
                //         notification.addNotification({
                //             message: "Something went wrong!",
                //             type: "error"
                //         });
                //     }
                //     $saveButton.blur();
                // }).fail((jqXHR, textStatus, errorThrown) => {
                //     notification.addNotification({
                //         message: textStatus + ': ' + errorThrown,
                //         type: "error"
                //     });
                //     $saveButton.blur();
                // });
                $saveForm.classList.remove('was-validated');
                event.preventDefault();
            }
        });

        $saveButton.addEventListener('click', event => {
            event.preventDefault();

            // Clear notifications
            // TODO: What is alert()?
            document.querySelector(".alert");
            // $('.alert').alert('close');
            $saveForm.submit();
        });
    };

    /**
     * To add back button to editor page
     */
    const initBackButton = () => {
        let $backButton = document.querySelector("#back");

        $backButton.addEventListener('click', event => {
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
        }).fail(notification.exception);
};
