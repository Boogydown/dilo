/**
 * A View for controlling the timer
 * constructor( options )
 *	options.el - div element to shrink via width %
 *	options.interval - ms between update
 * start( time )
 *	start the timer for "time" ms; when done it dispatches a "complete" event
 * stop ()
 *	stops timer and returns remaining time
 */
App.Views.TimerView = Backbone.View.extend({
	initialize : function( options ){
		_.bindAll( this, "start", "stop", "_updateTimer" );
		this.interval = options.interval || 100;
		this.timerID = -1;
	},
	
	start : function( time ) {
		this.totalTime = time || 15000;
		this.timeToStop = this.totalTime + new Date().getTime();
		$(this.el).css("width","100%");
		this.timerID = setInterval( this._updateTimer, this.interval );
	},
	
	stop : function () {
		if ( this.timerID != -1 )
			clearInterval( this.timerID );
		this.timerID = -1;
		// return remaining time
		return Math.ceil((this.timeToStop - new Date().getTime()) / 10);
	},
	
	_updateTimer : function() {
		var timeLeft = this.timeToStop - new Date().getTime();
		if ( timeLeft < 0 ) {
			timeLeft = 0;
			this.stop();
			this.trigger( "complete" );
		}
		$(this.el).css("width", (timeLeft / this.totalTime * 100) + "%" );
		$(this.el).text( Math.ceil(timeLeft / 10) );
	}	
});