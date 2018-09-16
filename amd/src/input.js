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
define(['qtype_shortmath/visual-math-input'], function (VisualMath) {
    return {
        initialize: () => {

            let readOnly = false;
            let $shortanswerInput = $('.shortmath .answer input');

            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $shortanswerInput.removeClass('d-inline');

            let input = new VisualMath.Input($shortanswerInput, '.answer');
            input.$input.hide();

            if (!input.$input.prop('readonly')) {
                input.onEdit = ($input, field) => {
                    // $input.val(field.latex());
                    $input.val('\\[' + field.latex() + '\\]');
                    console.log($input.val());
                    $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
                };

            } else {
                readOnly = true;
                input.disable();
            }

            if ($shortanswerInput.val()) {
                input.field.write(
                   $shortanswerInput.val().slice(2,-2) 
                   );
            }

            if (!readOnly) {
                let controls = new VisualMath.ControlList('#controls_wrapper');
                controls.enableAll();
            }
        }
    };
});
