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
import Ajax from "core/ajax";
import notification from "???";
/**
 * @module qtype_shortmath/input
 */

export const initialize = (inputname, readonly, questionId) => {
    var readOnly = readonly;
    var shortanswerInput = document.querySelector(`#${inputname}`);
    // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
    shortanswerInput.classList.remove('d-inline');
    var $parent = shortanswerInput.parentElement;

    var input = new VisualMath.Input(shortanswerInput, $parent);
    input.$input.hide();

    if (!readonly) {
        input.onEdit = function ($input, field) {
            $input.val(field.latex());
            $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
        };

    } else {
        readOnly = true;
        input.disable();
    }

    if (shortanswerInput.val()) {
        input.field.write(
            shortanswerInput.val()
        );
    }

    if (!readOnly) {
        Ajax.call([{
            methodname: 'qtype_shortmath_get_template',
            args: {
                'questionid': questionId
            }
        }])[0].done(response => {
            var controlsWrapper = shortanswerInput.parents('.shortmath').find('.controls_wrapper');
            var controls = new VisualMath.ControlList(controlsWrapper);

            let template = JSON.parse(response['template']);
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
        }).fail(notification.exception);
    }
};
