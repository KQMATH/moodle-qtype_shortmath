/**
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
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
                    $input.val(field.latex());
                    console.log($input.val());
                    $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
                };

            } else {
                readOnly = true;
                input.disable();
            }

            if ($shortanswerInput.val()) {
                input.field.write($shortanswerInput.val());
            }

            if (!readOnly) {
                let controls = new VisualMath.ControlList('#controls_wrapper');
                controls.enableAll();
            }
        }
    };
});
