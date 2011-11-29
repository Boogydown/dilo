/**
 * Subclass of TimerView that only shows seconds countdown
 */
App.Views.WaitTimerView = App.Views.TimerView.extend({
	renderPercent: function( p ) { /*do nothing*/ },
	renderMS: function( ms ) {
		var e = $(this.el);
		e.css({display:"block"});
		e.text( Math.ceil( ms / 1000 ) );
		e.hide("puff",{
			percent:800,
			duration: 1100,
			queue: false,
			easing: "linear"
		});
	}
});