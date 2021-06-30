import MathQuill from "qtype_shortmath/mathquill";

// When a control button is clicked, the input blurs.
// This lets the control button know which input to act on.
let lastFocusedInput = null;

class Input {
    #rawInput;  // Plain HTMLInputElement
    #mathInput; // MathQuill Field
    #parent;
    #mathquillContainer;
    #textarea;

    constructor(input, inputParent) {
        this.#rawInput = input;
        if (typeof inputParent === "string") {
            this.#parent = input.closest(inputParent);
        }
        this.#mathquillContainer = document.createElement("div");
        this.#mathquillContainer.classList.add("visual-math-input-field");
        let MQ = MathQuill.getInterface(2);
        this.#mathInput = MQ.MathField(this.#mathquillContainer, {
            spaceBehavesLikeTab: true,
            handlers: {
                edit: field => {
                    this.onEdit(input, field);
                }
            }
        });
        this.parent.appendChild(this.#mathquillContainer);
        this.onEdit = ($input, field) => {
            $input.value = `\\[ ${field.latex()} \\]`;
        };
        this.#textarea = this.parent.querySelector("textarea");
        this.textarea.addEventListener("blur", () => {
            lastFocusedInput = this;
        });
    }

    get parent() {
        return this.#parent;
    }

    get textarea() {
        return this.#textarea;
    }

    get rawInput() {
        return this.#rawInput;
    }

    get mathInput() {
        return this.#mathInput;
    }

    enable() {
        this.textarea.setAttribute("disabled", false);
    }

    disable() {
        this.textarea.setAttribute("disabled", true);
    }

}

class Control {
    element = null;

    constructor(name, text, onClick) {
        this.name = name;
        this.text = text;
        this.onClick = onClick;
    }

    enable() {
        if (this.element !== null) {
            return;
        }
        this.element = document.createElement("button");
        this.element.innerHTML = this.text;
        this.element.classList.add("visual-math-input-control", "btn", "btn-primary");
        // this.element.addEventListener("click", event => {
        // event.preventDefault();
        // if (lastFocusedInput !== null) {
        // TODO: mathInput or textfield?
        //     this.addEventListener("click", lastFocusedInput.mathInput);
        //     lastFocusedInput.mathInput.focus();
        // }
        // });
    }

}

class ControlList {
    controls = [];

    constructor(wrapper) {
        this.wrapper = wrapper;
        this.wrapper.classList.add("visual-math-input-wrapper");
        this.defineDefault();
    }

    define(name, text, onClick) {
        this.controls[name] = new Control(name, text, onClick);
    }

    enable(names) {
        for (let name of names) {
            let control = this.controls[name];
            control.enable();
            console.log(control);
            this.wrapper.appendChild(control.element);
        }
    }

    enableAll() {
        for (let control of this.controls) {
            control.enable();
            this.wrapper.appendChild(control.element);
        }
    }

    defineDefault() {
        // It is also possible to render \\[ \\binom{n}{k} \\] with MathJax.
        // Using MathQuill's HTML output is slightly less clean, but we avoid using YUI and MathJax.

        let sqrt = '<span class="mq-root-block">&radic;</span>';
        let int = '<span class="mq-root-block">&int;</span>';
        let sum = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
        let lim = '<span class="mq-root-block">lim</span>';

        let nchoosek =
            `<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">
            <span class="mq-root-block">
                <span class="mq-non-leaf">
                    <span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">(</span>
                    <span class="mq-non-leaf" style="margin-top:0;">
                        <span class="mq-array mq-non-leaf">
                            <span style="font-size: 14px;">
                                <var>n</var>
                            </span>
                            <span style="font-size: 14px;">
                                <var>k</var>
                            </span>
                        </span>
                    </span>
                    <span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">)</span>
                </span>
            </span>
        </div>`;

        let divide = '<span class="mq-root-block">/</span>';
        let plusminus = '<span class="mq-root-block">&plusmn;</span>';
        let theta = '<span class="mq-root-block">&theta;</span>';
        let pi = '<span class="mq-root-block">&pi;</span>';
        let infinity = '<span class="mq-root-block">&infin;</span>';

        let caret = `
        <div class="mq-math-mode" style="cursor:pointer;font-size:100%;">
            <span class="mq-root-block">
                <var>x</var>
                <span class="mq-supsub mq-non-leaf mq-sup-only">
                    <span class="mq-sup">
                        <var>y</var>
                    </span>
                </span>
            </span>
        </div>`;


        this.define("sqrt", sqrt, field => field.cmd("\\sqrt"));
        this.define("int", int, field => field.cmd("\\int"));
        this.define("sum", sum, field => field.cmd("\\sum"));
        this.define("lim", lim, field => {
            field.cmd("\\lim").typedText("_").write("x").cmd("\\to").write("0").moveToRightEnd();
        });
        this.define("nchoosek", nchoosek, field => field.cmd("\\choose"));
        this.define("divide", divide, field => field.cmd("\\frac"));
        this.define("plusminus", plusminus, field => field.cmd("\\pm"));
        this.define("theta", theta, field => field.cmd("\\theta"));
        this.define("pi", pi, field => field.cmd("\\pi"));
        this.define("infinity", infinity, field => field.cmd("\\infinity"));
        this.define("caret", caret, field => field.cmd("^"));
    }

}

export default { Input, Control, ControlList };