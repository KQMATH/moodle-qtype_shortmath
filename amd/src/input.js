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
 * @module     qtype_shortmath/input
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */
import VisualMath from "qtype_shortmath/visual-math-input";
import { getShortmathEditorconfig } from "./api_helpers";

export const initialize = async (inputname, readonly, questionId) => {
    var readOnly = readonly;
    inputname = inputname.replace(":", "\\:");
    var shortanswerInput = document.querySelector(`#${inputname}`);
    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
    shortanswerInput.classList.remove('d-inline');
    var parent = shortanswerInput.parentElement;

    var input = new VisualMath.Input(shortanswerInput, parent);
    input.rawInput.style.display = "none";

    if (!readonly) {
        input.onEdit = function ($input, field) {
            $input.value = field.latex();
            $input.dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
        };

    } else {
        readOnly = true;
        input.disabled = true;
    }

    if (shortanswerInput.value.length > 0) {
        input.mathInput.write(
            shortanswerInput.value
        );
    }

    if (!readOnly) {
        const template = await getShortmathEditorconfig(parseInt(questionId));
        var controlsWrapper = shortanswerInput.closest('.shortmath').querySelector('.controls_wrapper');
        var controls = new VisualMath.ControlList(controlsWrapper);
        if (template === null) {
            controls.defineDefault();
        } else {
            template.forEach(value => {
                let html = value['button'];
                let command = value['expression'];
                controls.define(command, html, field => field.write(command));
            });
        }
        controls.enableAll();
    }
};
