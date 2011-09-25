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
    poll : {},

    /* Poll the server for changes
     * @param options - options to pass along to the fetch; success only called if the poll is successful
     * @param attribute - attribute of which to listen for changes; if param is null, defaults to ANY Model changes
     * @param interval - defaults 300ms polling intervals
     * @param timeout - default 10sec until we stop polling
    */
    pollFetch : function( options, attribute, interval, timeout) {
        if ( this.poll.polling ) throw new Error("Can only poll one at a time");
        _.bindAll( this, "_pollChangedHandler", "fetch" );
        options || (options = {});
        interval || (interval = 300);
        timeout || (timeout = 10000);
        var changeStr = "change" + (attribute ? ":" + attribute :"");
        var model = this;
        this.poll = {
            polling: true,
            interval: interval,
            success: options.success,
            options: options,
            next: function() {
                if ( this.polling )
                    setTimeout( model.fetch, this.interval, this.options );
            },
            stop: function( timedout ) {
                model.unbind( changeStr, model._pollChangedHandler);
                if ( timedout && this.polling ) {
                    this.polling = false;
                    options.error();
                }
                this.polling = false;
            }
        };
        _.bindAll( this.poll, "next", "stop" );
        //listen for the change, either general or attribute-specific
        this.bind( changeStr, this._pollChangedHandler );

        // this fetch success will trigger the next polling fetch
        options.success = this.poll.next;
        this.fetch( options );
        setTimeout( this.poll.stop, timeout, true );
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
        level:0,
        ranking:0,
        classID:"",
        sessionModelID:""
//            questionModelCollection:

    }
});

App.Models.SessionModel = App.Models.PollModel.extend({
    //url : "http://127.0.0.1:3000/sessions",
    railsModel : "sessions",
    defaults : {
        players : null,
        playerId : "",
        questionLogic : null,
        questionsCollection : null,
        currentQuestion : 0,
        state : "waiting",
        finalResponse : null
    }
});

App.Models.QuestionModel = App.Models.PollModel.extend({
    //url : "http://127.0.0.1:3000/questions",
    railsModel : "questions",
    defaults : {
        userID: "",
        stemContent: {},
        responseContent: {},
        correctResponse: "",
        scoreResponse: function(response, context){return context.get("pendingResponse") == context.get("correctResponse");},
        pendingResponse: "",
        submittedResponses: []
    },

    initialize : function() {
        // we want to use a new array, not the static one kept in defaults
        this.set( {submittedResponses : []} );
    }
});
