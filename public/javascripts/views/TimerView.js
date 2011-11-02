/**
 * A View for controlling the timer
 * constructor( options )
 *	options.el - div element containing tiner
 *	options.interval - ms between update
 * start( time )
 *	start the timer for "time" ms; when done it dispatches a "complete" event
 * stop ()
 *	stops timer and returns remaining time
 * extend and override renderPercent to receive % left on timer
 * extend and override renderMS to receive ms left on timer
 */
App.Views.TimerView = Backbone.View.extend({
	initialize : function( options ){
		_.bindAll( this, "start", "stop", "_updateTimer" );
		this.interval = options.interval || 100;
		this.timerID = null;
	},
	
	start : function( time ) {
		if ( this.timerID ) this.stop();
		this.totalTime = time || 15000;
		this.timeToStop = this.totalTime + new Date().getTime();
		this._updateTimer();
		this.timerID = setInterval( this._updateTimer, this.interval );
	},
	
	stop : function () {
		if ( this.timerID != null ) clearInterval( this.timerID );
		this.timerID = null;
		return this.getTime();
	},
	
	//return remaining time
	getTime : function() {
		return Math.ceil((this.timeToStop - new Date().getTime()) / 10);
	},
	
	_updateTimer : function() {
		var timeLeft = this.timeToStop - new Date().getTime();
		if ( timeLeft < 0 ) {
			timeLeft = 0;
			this.stop();
			this.trigger( "complete" );
		}
		this.renderMS( timeLeft );
		this.renderPercent( timeLeft / this.totalTime * 100 );
	},
	
	renderPercent : function ( p ) {	
		$(this.el).css("width", p + "%" );
	},
	
	renderMS : function ( ms ) {
		$(this.el).text( Math.ceil(ms / 10) );
	}	
});