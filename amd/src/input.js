define(['plugin_name/visual-math-input'], function (VisualMath) {
   return {
      initialize: () => {
	 let input = new VisualMath.Input('.shortmath .answer input', '.answer');
	 input.$input.hide();
	 let controls = new VisualMath.ControlList('#controls_wrapper');
	 controls.enableAll();
      }
   };
});
