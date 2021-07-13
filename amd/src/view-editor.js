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
 * @module     qtype_shortmath/view-editor
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */

import notification from "core/notification";
import Templates from "core/templates";
import {
    getShortmathTemplate,
    saveShortmathTemplate
} from "qtype_shortmath/api-helpers";
import VisualMath from "qtype_shortmath/visual-math-input";

let lastFocusedInput = null;
let dragged;
let nodes;
let draggedIndex;
let isSuccess = true;

/**
 * An EditorInput represents a collection of three items:
 * 
 * 1. HTMLInputElement - shows the evaluated latex 
 * 2. MathQuill field  - visual representation of math expressions
 * 3. 
 */
class EditorInput extends VisualMath.Input {

    constructor(input, parent) {
        super(input, parent);
        // textarea inherited from VisualMath.Input
        this.textarea.addEventListener("focusout", () => {
            lastFocusedInput = this;
        });
        this.rawInput.setAttribute("required", true);
        this.rawInput.classList.add("form-control");
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("invalid-feedback", "text-nowrap");
        this.parent.appendChild(errorDiv);
    }

    change() {
        super.onEdit = (rawInput, mathInput) => {
            rawInput.value = mathInput.latex();
            if (!isSuccess && rawInput.closest(".test-box") !== null) {
                if (rawInput.value.length === 0) {
                    rawInput.parentElement.children.forEach(element => {
                        element.classList.remove("form-control", "is-valid");
                        element.classList.add("form-control", "is-invalid");
                    });
                } else {
                    rawInput.parentElement.children.forEach(element => {
                        element.classList.remove("form-control", "is-invalid");
                        element.classList.add("form-control", "is-valid");
                    });
                }
            }
            rawInput.dispatchEvent(new Event("change"));
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

        // this.element.removeEventListener("click");
        this.element.onclick = event => {
            event.preventDefault();

            document.querySelector(":focus").blur();


            if (lastFocusedInput !== null) {
                if (lastFocusedInput.mathInput === undefined) {
                    // For plain text mathInput.
                    lastFocusedInput.focus();
                    return;
                }
                this.onClick(lastFocusedInput.mathInput);
                lastFocusedInput.mathInput.focus();
            }
        };

        this.element.id = this.name;
        this.element.setAttribute("draggable", true);

        this.element.addEventListener("dragstart", event => {
            dragged = event.target;
            nodes = Array.from(dragged.parentNode.children); //buttons on the control list
            draggedIndex = nodes.indexOf(dragged);
            // Add the target element's id to the data transfer object
            event.dataTransfer.setData("text", event.target.id);
            event.dataTransfer.dropEffect = "move";
            // event.target.style.opacity = 0.5;
            document.querySelector(".delete-box").classList.remove("d-none");
        });

        this.element.addEventListener("dragend", event => {
            event.target.style.opacity = "";
            document.querySelector(":focus").blur();
            if (document.getElementById("placeholder") !== null) {
                document.getElementById("placeholder").replaceWith(dragged);
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
     * @param buttonMathInput
     * @param expressionMathInput
     * @returns {boolean}
     */
    add(buttonMathInput, expressionMathInput) {

        // document.querySelector(":focus").blur();
        // TODO: Why get the outerHTML?
        // let mathquillExpressionString = buttonMathInput.__controller.container[0].querySelector(".mq-root-block").outerHTML;
        // const mathquillExpressionHtml = DOMParser.prototype.parseFromString(mathquillExpressionString);

        const mathquillExpression = buttonMathInput.__controller.container[0].querySelector(".mq-root-block");

        // let mqEmptyElement = mathquillExpression.querySelector(".mq-empty");
        // if (mqEmptyElement.closest(".mq-int") !== null && mqEmptyElement !== null) {
        //    // Removes super/subscript white space in buttons.
        //     mqEmptyElement.closest(".mq-supsub").parentElement.removeChild(mqEmptyElement.closest(".mq-supsub"));
        // }
        // mqEmptyElement.parentElement.removeChild(mqEmptyElement); // Removes white space from buttons.

        // const span = document.createElement("span");
        // span.appendChild();
        // mathquillExpression.querySelector("big").replaceWith((i, element) => {
        //     return `<span>${element}</span>`;
        // });

        // let $frac = mathquillExpression.querySelector(".mq-fraction"); // Division symbol.
        // if ($frac.length > 0) {
        //     mathquillExpression.append("<var>" + mathquillExpression.querySelector(".mq-numerator").text() + "</var>" +
        //         "<span>/</span><var>" + mathquillExpression.querySelector(".mq-denominator").text() + "</var>");
        //     $frac.remove();
        // }

        // let $binom = mathquillExpression.querySelector(".mq-paren.mq-scaled"); // Binomial symbol.
        // let $supsub = mathquillExpression.querySelector(".mq-supsub"); // Power symbol.
        // let $vars = mathquillExpression.querySelector("var");

        // if ($binom.length > 0 || $supsub.length > 0 || $vars.length > 0) {
        //     if ($binom.length > 0) {
        //         $binom.css("transform", "scale(0.8, 1.5)"); // Resize binomial.
        //         mathquillExpression.querySelector(".mq-array.mq-non-leaf").parentElement.classList.add("mt-0");
        //         $html.querySelector("var").parentElement.style.fontSize = "14px";
        //     }
        //     mathquillExpressionString =
        //         `<div class="mq-math-mode" style="cursor:pointer;font-size:100%;" id="${Date.now()}">
        //           ${mathquillExpression.outerHTML}
        //       </div>`;
        //     mathquillExpression = DOMParser.prototype.parseFromString(mathquillExpressionString);
        // }

        const mathquillExpressionString = mathquillExpression.outerHTML;

        this.addControl("btn_" + Date.now(), mathquillExpressionString, expressionMathInput.latex());
        return true;
    }

    addAll(value) {

        let name = value["name"];
        let html = value["button"];
        let command = value["expression"];
        this.addControl(name, html, command);
    }

    addControl(name, html, command) {
        let control = new EditorControl(name, html, mathInput => mathInput.write(command), command);
        this.controls[name] = control;
        control.enable();
        this.wrapper.append(control.element);
    }
}

/**
 * Entry point of this file. All the parameters come from view_editor.php at $PAGE->requires->js_call_amd
 */
// "test", "btn", "exp", 0, "", "/question/type/shortmath/editor_action.php", "/question/type/shortmath/editor_manager.php"
export const initialize = (templateId, templateName, managerPath) => {


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

    let templateNameInput;

    let vmiButton; // EditorControl object
    let buttonRawInput; // Raw HTMLInputElement
    let buttonMathInput; // MathQuill field

    let vmiExpression;
    let expressionRawInput;
    let expressionMathInput;

    let vmiTest;
    let testRawInput;
    let testMathInput;

    let controlsWrapper;
    let vmiTestAndSaveContainer; // Container for testing the buttons for this template
    let target;

    let saveButton;
    let saveForm;
    let controls;

    // To prevent calls to show test box repeatedly
    let isDataVisible = false;

    /**
     * Shortmath input fields
     */
    const initInputFields = () => {

        testRawInput = document.querySelector("#test");
        buttonRawInput = document.querySelector("#btn");
        expressionRawInput = document.querySelector("#exp");
        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        testRawInput.classList.remove("d-inline");

        vmiTest = new EditorInput(testRawInput, ".answer");
        vmiTest.change();
        testMathInput = vmiTest.mathInput;

        if (testRawInput.value) {
            testMathInput.write(
                testRawInput.value
            );
        }

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        buttonRawInput.classList.remove("d-inline");

        vmiButton = new EditorInput(buttonRawInput, ".answer");
        vmiButton.change();
        buttonMathInput = vmiButton.mathInput;

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        expressionRawInput.classList.remove("d-inline");

        vmiExpression = new EditorInput(expressionRawInput, ".answer");
        vmiExpression.change();
        expressionMathInput = vmiExpression.mathInput;

    };

    /**
     * Wrapper for toolbar and drag and drop functionality for buttons
     */
    const initControlsWrapper = () => {

        controlsWrapper = document.querySelector(".controls_wrapper");

        controlsWrapper.classList.add("visual-math-input-wrapper");
        controlsWrapper.id = "target";

        controlsWrapper.addEventListener("drop", event => {
            event.preventDefault();

            if (target.id === dragged.id) {
                event.dataTransfer.clearData();
                return;
            }

            document.getElementById("placeholder").replaceWith(dragged);
            event.dataTransfer.clearData();
        });

        controlsWrapper.addEventListener("dragover", event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        controlsWrapper.addEventListener("dragenter", event => {

            let targetId;
            if (event.target.classList.contains("visual-math-input-wrapper")) {
                targetId = event.target.lastChild.id;
            } else if (event.target.nodeName !== "BUTTON") {
                targetId = event.target.closest("button").id;
            } else {
                targetId = event.target.id;
            }

            if (targetId === "placeholder") {
                return;
            }

            target = document.getElementById(targetId);

            let targetIndex = nodes.indexOf(target);
            if (draggedIndex === targetIndex) { //movement within button
                return;
            }

            let empty = document.createElement("button");
            empty.id = "placeholder";
            empty.classList.add("visual-math-input-control", "btn", "btn-primary");
            empty.setAttribute("draggable", true);
            // empty.style.border = "2px solid red";

            if (target.parentNode.contains(dragged)) {
                target.parentNode.removeChild(dragged);
            } else {
                target.parentNode.removeChild(document.getElementById("placeholder"));
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
    const initAddForm = async () => {
        const addForm = document.querySelector("#addForm");
        const addButton = document.querySelector("#add");

        vmiTestAndSaveContainer = document.querySelector(".test-box");
        controls = new EditorControlList(controlsWrapper);

        vmiButton.parent.querySelector(".invalid-feedback").textContent = "Button is empty or invalid!";
        vmiExpression.parent.querySelector(".invalid-feedback").textContent = "Expression is empty or invalid!";

        addButton.addEventListener("click", event => {
            event.preventDefault();

            addForm.dispatchEvent(new Event("submit"));
        });
        addForm.addEventListener("submit", event => {
            event.preventDefault();
            event.stopPropagation();

            if (addForm.checkValidity() === false) {
                isSuccess = false;

                // TODO: Is it really needed to unfocus the add button?
                document.querySelector(":focus").blur();

                addForm.querySelectorAll("input[type=text].form-control").forEach(element => {
                    if (element.value.length === 0) {
                        element.parentElement.querySelector(".visual-math-input-field").classList.add("form-control", "is-invalid");
                    }
                });
            } else {
                isSuccess = controls.add(buttonMathInput, expressionMathInput);
                if (isSuccess) {
                    if (!isDataVisible) {
                        isDataVisible = true;
                    }

                    addForm.querySelector(".visual-math-input-field").classList.remove("form-control", "is-valid");

                    //clear inputs
                    buttonMathInput.latex("");
                    expressionMathInput.latex("");
                }
            }
        });



        try {
            const template = await getShortmathTemplate(templateId);
            // TODO: insert template data into page
        } catch (error) {
            notification.addNotification({
                message: error,
                type: "error"
            });
        }

        // Ajax.call([{
        //     methodname: "qtype_shortmath_get_template",
        //     args: { questionid: templateId },
        //     done: response => {
        //         // Do something with the response
        //         let data = JSON.parse(response);
        //         isDataVisible = true;
        //         JSON.parse(data["template"]).forEach(controls.addAll.bind(controls));
        //     },
        //     fail: () => {
        //         notification.addNotification({
        //             message: `Couldn't add control`,
        //             type: "error"
        //         });
        //     }
        // }]);
    };

    /**
     * To delete buttons from toolbar
     */
    const initDeleteButton = async () => {
        let deleteIcon = document.querySelector(".delete-icon");

        deleteIcon.addEventListener("dragover", event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        deleteIcon.addEventListener("drop", event => {
            event.preventDefault();
            let parentNode = dragged.parentNode;
            if (parentNode !== null) {
                parentNode.removeChild(dragged);
                if (parentNode.firstElementChild === null) {
                    testMathInput.latex("");
                    isDataVisible = false;
                }
            } else {
                let placeholder = document.getElementById("placeholder");
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
    const initSaveForm = async () => {
        const saveButton = document.querySelector("#save");
        templateNameInput = document.querySelector("#name");
        const saveForm = document.querySelector("#saveForm");

        templateNameInput.addEventListener("blur", () => {
            lastFocusedInput = templateNameInput;
        });

        saveForm.addEventListener("submit", event => {
            event.preventDefault();

            if (saveForm.checkValidity() === false) {
                saveForm.classList.add("was-validated");
                event.stopPropagation();
            } else {
                let data = [];
                let items = controls.controls;

                controlsWrapper.querySelectorAll("button").forEach(element => {
                    let control = items[element.id];
                    data.push({
                        name: control["name"],
                        button: control["text"],
                        expression: control["command"]
                    });
                });

                const templateId = saveShortmathTemplate(templateNameInput, JSON.stringify(data), templateId);
                onSave(templateId);

                // }).fail((jqXHR, textStatus, errorThrown) => {
                //     notification.addNotification({
                //         message: textStatus + ": " + errorThrown,
                //         type: "error"
                //     });
                //     saveButton.blur();
                // });
                saveForm.classList.remove("was-validated");
            }
        });

        saveButton.addEventListener("click", event => {
            event.preventDefault();
            saveForm.dispatchEvent(new Event("submit"));
        });
    };

    const onSave = (templateId) => {
        if (templateId > 0) {
            notification.addNotification({
                message: "Configuration saved! Please wait...",
                type: "success"
            });

            // TODO: display: block; or visibility: visible; ?
            document.querySelector("overlay-div").style.display = "block";

            setTimeout(() => {
                window.location.replace(managerPath);
            }, 5000);
        } else {
            notification.addNotification({
                message: "Configuration saved!",
                type: "success"
            });

            // TODO: Is controlsWrapper a jquery element or plain dom element?
            controlsWrapper.innerHTML = "";
            controls = new EditorControlList(controlsWrapper);
            templateNameInput.value = "";
            testMathInput.latex("");
            buttonMathInput.latex("");
            expressionMathInput.latex("");
            isDataVisible = false;
        }
        saveButton.blur();
        return { controls, isDataVisible };
    };

    /**
     * To add back button to editor page
     */
    const initBackButton = async () => {
        const backButton = document.querySelector("#back");

        backButton.addEventListener("click", event => {
            event.preventDefault();
            window.location.replace(managerPath);
        });
    };

    Templates.render("qtype_shortmath/editor", context).then(
        (html, js) => {
            Templates.appendNodeContents(`div[role="main"]`, html, js);
            initInputFields();
            initControlsWrapper();
            initAddForm();
            initDeleteButton();
            initSaveForm();
            initBackButton();
        }).fail(notification.exception);
};
