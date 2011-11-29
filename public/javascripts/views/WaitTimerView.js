/**
 * Subclass of TimerView that only shows seconds countdown
 */
App.Views.WaitTimerView = App.Views.TimerView.extend({
	renderPercent: function( p ) { /*do nothing*/ },
	renderMS: function( ms ) {
		var e = $(this.el);
		//e.css({display:"block"});
		e.text( Math.ceil( ms / 1000 ) );
		if (!this.startStyle)
			this.startStyle = {
				fontSize: e.css("fontSize"),
				marginTop: e.css("marginTop"),
				opacity: 1
			};
		e.css(this.startStyle).animate({
			fontSize: "920px",
			marginTop: "-347px",
			opacity: 0
		},{
			duration:1100,
			queue:false,
			easing:"linear"
		});
/*		e.hide("puff",{
			percent:800,
			duration: 1100,
			queue: false,
			easing: "linear"
		});
*/	}
});