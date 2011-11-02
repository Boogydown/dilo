/**
 * Subclass of TimerView that only shows seconds countdown
 */
App.Views.WaitTimerView = App.Views.TimerView.extend({
	renderPercent: function( p ) { /*do nothing*/ },
	renderMS: function( ms ) {
		$(this.el).text( Math.ceil( ms / 1000 ) );
	}
});