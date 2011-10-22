/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    initialize : function (options) {
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", "loadQuestion" );
        this.session = options.session;
		this.session.questionsModel = this.model;
		this.player = this.session.myPlayer;
    },

    start : function (){
        this.model.fetch( {success:this.loadQuestion} );
        this.gameOver = false;
    },

	loadQuestion : function( qNum ) {
		isNaN(parseInt(qNum)) && (qNum = 0);
		if ( qNum != this.model.get("itemNumber")) {
			this.model.set({"itemNumber" : qNum}, {silent: true});
			this.render();
		
			// this must come after at least the first render since its div isn't in the DOM 'til afterward
			if ( !this.timer ) {
				this.timer = new App.Views.TimerView({el:"#timerBar", interval:100});
				this.timer.bind( "complete", this.timerDone );
			}
			// re-align to new element (cuz we re-render at each question)
			this.timer.el = $("#timerBar").get(0);
			this.timer.start( this.QUESTION_TIME );
		}
        this.session.pollFetch( {success:this.sessionStateChange}, null, 1, 30000 );
    },

	// session pollfetch listener.  States originating from the server callback to here...
    sessionStateChange : function() {
		var timeToWaitBeforeLoadingNextQuestion = 0;
		switch ( this.session.get( "state" ) ) {
			case "won":
				this.timer.stop();
				var qData = this.model.getCurQuestion();
				
				// HACK
				qData.winner = this.session.get( "game" ).game_questions[ qData.itemNumber ].winner;
				if(qData.winner)
                {
                    var myID = this.session.myPlayer.id;
                    var stats = {
                        me: {
                            won: qData.winner == myID,
                            score: this.session.myPlayer.get("score"),
                            response : _.last(this.session.myPlayer.get( "responses" ))
                        },
                        them: {
                            won: qData.winner != myID,
                            score: this.session.theirPlayer.get("score"),
                            response : _.last(this.session.theirPlayer.get( "responses" ))
                        },
                        questionData: qData
                    };
                    $("#winner").text( stats.me.won ? "You won!" : "You lost!" );
                    this.showPlayerStates( stats );
                    // wait a bit before loading next question...
				    timeToWaitBeforeLoadingNextQuestion = 2400;
                }
				break;
			case "timedOut":
				//TODO: this is where we mark both as losers and advance to next Questio
				// wait a bit before loading next question... 
				timeToWaitBeforeLoadingNextQuestion = 2400;
				break;
			case "incorrect":
			default:
				//TODO: regardless of who was incorrect, just check players' responses and all are wrong
				// timer does NOT stop, and we don't update the questions (i.e. session.current_question is still same #)

				// immediately start pollfetch again...
				timeToWaitBeforeLoadingNextQuestion = 0;
				break;
		}
		
		setTimeout( this.loadQuestion, timeToWaitBeforeLoadingNextQuestion, this.session.get("current_question") );						
	},

    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this.session ) );
		
		// since different question types each have their own unique rendering logic, we'll separate
		//	the general game view from the question-logic-specific view (i.e. MC, FillInTheBlank, DnD, etc)
        $("#questionArea", $(this.el) ).html( this.renderQuestion() );
    },

	
    //========= start question-specific logic =============
	QUESTION_TIME : 45000,
	
	// bind events to the answer choices
    events : {
        "click #choice0" : "acSelected",
        "click #choice1" : "acSelected",
        "click #choice2" : "acSelected",
        "click #choice3" : "acSelected"
    },
	
	// render multiple-choice-specific question logic
    renderQuestion : function (  ) {
        return _.template( $("#gameQuestionTemplate_MC").html(), this.model.getCurQuestion() );
		
		// question styling...
		// TODO: these should be implemented into acSelected and showPlayerStates
        $(".answerChoice", $(this.el)).addClass("unselected");
        $(".answerChoice", $(this.el)).bind('click', function(event) {
            $(this).removeClass("unselected");
            if($(this).attr("correct") == "true")
                $(this).addClass("player1-correct")
            else
                $(this).addClass("player1-incorrect")
            $(this).siblings(".answerChoice").removeClass("unselected");
            $(this).siblings(".answerChoice").filter('[correct="true"]').addClass("unselected-correct")
            $(this).siblings(".answerChoice").filter('[correct!="true"]').addClass("unselected-incorrect");
            $(".answerChoice").unbind(event);
        });
		
    },

	// immediate reaction to UI
    acSelected : function ( ev ){
        var myDiv = ev.currentTarget;
        this.model.set( {pendingResponse:myDiv.id.substr(myDiv.id.length - 1)}, {silent:true} );
        // in non-MC items (i.e. non single-action items), this will probably save pendingResponse to server
        this.submit();
    },
	
	// reaction to server-returned states
	showPlayerStates : function ( states ) {
		//TODO: show opponent's and my responses
	},
    //=========== end question-specific logic ===============

    submit : function (){
        // copy over from pending to submitted...
        var resp = this.model.get( "pendingResponse" );
        this.session.myPlayer.get( "responses" ).push( resp );
		var myTime = this.timer.getTime();
		var qData = this.model.getCurQuestion();
        this.session.myPlayer.save({
			"currentGameId": this.session.get("game").id,
			"currentGameQuestion": qData.id,
			"newResponse": resp,
			"sessionId": this.session.id,
			"time": myTime,
			"current_question":this.session.get("current_question")
		});
		console.log("sent: " + JSON.stringify(this.session.myPlayer) );
    },
	
	timerDone : function (){
		//TODO: notify of time out!
		alert("Time out!");
		// TODO: session should return state "lost" or "timed out"
	}	
});