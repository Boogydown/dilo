/**
 * Subclass of TimerView that only shows seconds countdown
 */
App.Views.WaitTimerView = App.Views.TimerView.extend({
	renderPercent: function( p ) { /*do nothing*/ },
	renderMS: function( ms ) {
		var e = $(this.el);
		e.text( Math.ceil( ms / 1000 ) );
		if ( ! this.startStyle )
			this.startStyle = {
				fontSize: e.css("fontSize"),
				marginTop: e.css("marginTop"),
				marginLeft: e.css("marginLeft"),
				opacity: 1
			};
			
		e.css( this.startStyle ).animate({
			fontSize: "1500px",
			marginTop: "-650px",
			marginLeft: "-96px",
			opacity: 0
		}, {
			duration: 1100,
			easing: "linear",
			queue: false,
		});
	}
});