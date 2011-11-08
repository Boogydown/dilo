/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 2:12 PM
 * To change this template use File | Settings | File Templates.
 */

/* RailsModel - base class for models that have persistence to Rails server
 *  the only real fancy thing here is that Rails uses urls that by default return
 *  "index," or an array (collection)
 */
App.Models.RailsModel = Backbone.Model.extend({
    url : function() {
          var base = this.railsModel;
          return ( this.isNew()
              ? base
              : base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id );
        }
});


/* PollModel - base Model that adds pollFetch, which allows for
 *  polling of changes from the server for the entire model, or a
 *  single attribute
 */
App.Models.PollModel = App.Models.RailsModel.extend({
    // put into the prototype, thus it's static and will prevent more than one pollFetch at a time (for now)
    poll : {
        polling: false,
		timedout: false,
        next: function() {
            if ( this.polling ){
				console.log( "next poll for " + this.changeStr );
                setTimeout( this.model.fetch, this.interval, this.options );
			}
        },
        stop: function( timedout ) {
			if ( ! this.polling ) console.log( "poll stopping (timedout:" + timedout + ")" );
            this.model.unbind( this.changeStr, this.model._pollChangedHandler);			
            this.timedout = timedout && this.polling;
			clearTimeout( this.timeoutID );
			this.polling = false;
			if ( this.timedout ) 
				this.options.error( );
			this.timedout = false;
        }
    },

    /* Poll the server for changes
     * @param options - options to pass along to the fetch; success only called if the poll is successful
     * @param attribute - attribute of which to listen for changes; if param is null, defaults to ANY Model changes
     * @param interval - defaults 300ms polling intervals
     * @param timeout - default 10sec until we stop polling
    */
    pollFetch : function( options, attribute, interval, timeout) {
        if ( this.poll.polling ) throw new Error("Can only poll one at a time");
		console.log( "starting new poll for " + attribute + " @ " + interval + " (" + timeout );
        _.bindAll( this, "_pollChangedHandler", "fetch" );
        options || (options = {});
        interval || (interval = 300);
        timeout || (timeout = 10000);
		
		// setup our static poll object
        this.poll.polling = true;
        this.poll.model = this;
        this.poll.changeStr = "change" + (attribute ? ":" + attribute :"");
        this.poll.interval = interval;
        this.poll.success = options.success;
        this.poll.options = options;
		
		// bind the "this" of poll's two methods to poll, itself
        _.bindAll( this.poll, "next", "stop" );
		
        //listen for the change, either general or attribute-specific
        this.bind( this.poll.changeStr, this._pollChangedHandler );

        // this fetch success will trigger the next polling fetch
        options.success = this.poll.next;
        this.fetch( options );
		
		// set our timeout
        this.poll.timeoutID = setTimeout( this.poll.stop, timeout, true );
    },

    _pollChangedHandler : function() {
        this.poll.stop();
        this.poll.success( this );
    }
});

App.Models.PlayerModel = App.Models.PollModel.extend({
    //url : "http://127.0.0.1:3000/players",
    railsModel : "players",
    defaults: {
        name:"",
		time:-1,
        level:0,
        ranking:0,
		score:0,
        classID:"",
        sessionModelID:"",
        responses:[]
    }
});