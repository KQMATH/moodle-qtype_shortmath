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
 * @author     Simen Wiik <simenwiik@hotmail.com>
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */

import notification from "core/notification";
import { getShortmathTemplate } from "qtype_shortmath/api_helpers";
import VisualMath from "qtype_shortmath/visual-math-input";

let lastFocusedInput = null;
let dragged;
let nodes;
let draggedIndex;
let isSuccess = true;

/**
 * An EditorInput represents a collection of two items:
 * 
 * 1. HTMLInputElement - shows the evaluated latex 
 * 2. MathQuill field  - visual representation of math expressions
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
            //document.querySelector(":focus").blur();
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
        const mathquillExpression = buttonMathInput.__controller.container[0].querySelector(".mq-root-block");
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
        if (this.boundInput !== null) {
            control.bindInput(this.boundInput);
        }
        this.wrapper.append(control.element);
    }
}

/**
 * Set up the page.
 *
 * @method init
 * @param {string} importIdString the string ID of the import.
 */
export const initialize = function (templateId, templateName, managerPath) {
    let editorPage = new EditorPage(templateId, templateName, managerPath);
};

/**
 * Entry point of this file. All the parameters come from view_editor.php at $PAGE->requires->js_call_amd
 */
// "test", "btn", "exp", 0, "", "/question/type/shortmath/editor_action.php", "/question/type/shortmath/editor_manager.php"
class EditorPage {

    constructor(templateId, templateName) {
        this.templateId = templateId;
        this.templateName = templateName;

        this.initInputFields();
        this.initControlsWrapper();
        this.initAddForm();
        this.initDeleteButton();
        this.addSubmitButtonEventListener();
    }

    vmiButton; // EditorControl object
    buttonRawInput; // Raw HTMLInputElement
    buttonMathInput; // MathQuill field
    vmiExpression;
    expressionRawInput;
    expressionMathInput;
    vmiTest;
    testRawInput;
    testMathInput;
    controlsWrapper;
    vmiTestAndSaveContainer; // Container for testing the buttons for this template
    target;
    controls;

    /**
     * Shortmath input fields
     */
    initInputFields() {
        this.testRawInput = document.querySelector("#id_mqtest");
        this.buttonRawInput = document.querySelector("#id_mqbtntext");
        this.expressionRawInput = document.querySelector("#id_mqexpression");
        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        this.testRawInput.classList.remove("d-inline");

        this.vmiTest = new EditorInput(this.testRawInput, this.testRawInput.closest('div'));
        this.vmiTest.rawInput.style.display = "none";
        this.vmiTest.change();
        this.testMathInput = this.vmiTest.mathInput;

        if (this.testRawInput.value) {
            this.testMathInput.write(
                this.testRawInput.value
            );
        }

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        this.buttonRawInput.classList.remove("d-inline");

        this.vmiButton = new EditorInput(this.buttonRawInput, this.buttonRawInput.closest('div'));
        this.vmiButton.rawInput.style.display = "none";
        this.vmiButton.addClass('shortmath-blue');
        this.vmiButton.change();
        this.buttonMathInput = this.vmiButton.mathInput;

        // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
        this.expressionRawInput.classList.remove("d-inline");
        this.vmiExpression = new EditorInput(this.expressionRawInput, this.expressionRawInput.closest('div'));
        this.vmiExpression.rawInput.style.display = "none";
        this.vmiExpression.change();
        this.expressionMathInput = this.vmiExpression.mathInput;

    };

    /**
     * Wrapper for toolbar and drag and drop functionality for buttons
     */
    initControlsWrapper() {
        this.controlsWrapper = document.querySelector(".controlswrapper");
        this.controlsWrapper.addEventListener("drop", event => {
            event.preventDefault();

            if (this.target.id === dragged.id) {
                event.dataTransfer.clearData();
                return;
            }

            document.getElementById("placeholder").replaceWith(dragged);
            event.dataTransfer.clearData();
        });

        this.controlsWrapper.addEventListener("dragover", event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        });

        this.controlsWrapper.addEventListener("dragenter", event => {

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

            this.target = document.getElementById(targetId);

            let targetIndex = nodes.indexOf(this.target);
            if (draggedIndex === targetIndex) { //movement within button
                return;
            }

            let empty = document.createElement("button");
            empty.id = "placeholder";
            empty.classList.add("visual-math-input-control", "mq-math-mode", "btn", "btn-primary");
            empty.setAttribute("draggable", true);
            if (this.target.parentNode.contains(dragged)) {
                this.target.parentNode.removeChild(dragged);
            } else {
                this.target.parentNode.removeChild(document.getElementById("placeholder"));
            }

            if (draggedIndex < targetIndex) {
                if (this.target.parentNode.lastChild !== this.target) {
                    this.target.parentNode.insertBefore(empty, this.target.nextSibling); //left to right
                } else {
                    this.target.parentNode.appendChild(empty);
                }
            } else {
                this.target.parentNode.insertBefore(empty, this.target); //right to left
            }

            nodes = Array.from(this.target.parentNode.children);
            draggedIndex = nodes.indexOf(empty);
        });
    };

    /**
     * To add buttons to toolbar in create mode/load buttons in edit mode
     */
    async initAddForm() {
        const addButton = document.querySelector("#id_mqaddbutton");

        this.vmiTestAndSaveContainer = document.querySelector(".test-box");
        this.controls = new EditorControlList(this.controlsWrapper);
        this.controls.bindInput(this.vmiTest);
        this.vmiButton.parent.querySelector(".invalid-feedback").textContent = "Button is empty or invalid!";
        this.vmiExpression.parent.querySelector(".invalid-feedback").textContent = "Expression is empty or invalid!";

        addButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            this.isSuccess = this.controls.add(this.buttonMathInput, this.expressionMathInput);
            if (isSuccess) {
                //Clear inputs
                this.buttonMathInput.latex("");
                this.expressionMathInput.latex("");
            }
        });

        if (this.templateId > 0) {
            try {
                const template = await getShortmathTemplate(this.templateId);
                template.forEach(this.controls.addAll.bind(this.controls));
            } catch (error) {
                notification.addNotification({
                    message: error,
                    type: "error"
                });
            }
        }
    };

    /**
     * To delete buttons from toolbar
     */
    async initDeleteButton() {
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
                    this.testMathInput.latex("");
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

    addSubmitButtonEventListener() {
        const submitBtn = document.querySelector("#id_submitbutton");
        submitBtn.addEventListener("click", event => {
            let data = [];
            let items = this.controls.controls;
            this.controlsWrapper.querySelectorAll("button").forEach(element => {
                let control = items[element.id];
                data.push({
                    name: control["name"],
                    button: control["text"],
                    expression: control["command"]
                });
            });
            const buttonsString = JSON.stringify(data);
            const hiddenElem = document.querySelector('[name="templatestring"]');
            hiddenElem.value = buttonsString;
        });
    };
}
