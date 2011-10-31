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
App.Views.WaitTimerView = Backbone.View.extend({
	initialize : function( options ){
		_.bindAll( this, "start", "stop", "_updateTimer" );
		this.interval = options.interval || 100;
		this.timerID = null;
	},
	
	start : function( time ) {
		if ( this.timerID ) return;
		this.totalTime = time || 15000;
		this.timeToStop = this.totalTime + new Date().getTime();
		//$(this.el).css("width","100%");
		
		$(this.el).text( 3 );
		this.timerID = setInterval( this._updateTimer, this.interval );
	},
	
	stop : function () {
		if ( this.timerID != null ) clearInterval( this.timerID );
		this.timerID = null;
		// return remaining time
		return this.getTime();
	},
	
	getTime : function() {
		return this.timeToStop - new Date().getTime();
	},
	
	_updateTimer : function() {
		var timeLeft = (this.timeToStop - new Date().getTime())/1000;
		//console.log("timeLeft=" + timeLeft);
		if ( timeLeft < 0 ) {
			timeLeft = 0;
			this.stop();
			this.trigger( "complete" );
		}
		//$(this.el).css("width", (timeLeft / this.totalTime * 1)  );
		$(this.el).text( Math.ceil(timeLeft) );
	}	
});