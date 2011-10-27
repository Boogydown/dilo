/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    initialize : function (options) {
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", "loadQuestion", "diloGameOver", "getPlayerResponses", "pusherDateRecieved" );
        this.session = options.session;
		this.session.questionsModel = this.model;
		this.player = this.session.myPlayer;
		
		// Enable pusher logging - don't include this in production
		Pusher.log = function(message) {
		  if (window.console && window.console.log) window.console.log(message);
		};

		// Flash fallback logging - don't include this in production
		WEB_SOCKET_DEBUG = true;

		var pusher = new Pusher('adfabbe2548895aaece0');
		var channel = pusher.subscribe('player-channel' + this.session.id);
		channel.bind('session-updated', this.pusherDateRecieved); 
		//{
		//  alert(data);
		//});
		
		//var channel = pusher.subscribe('player-channel');
		//this.sesssionBackpusher = new Backpusher(channel, this.session);
		//this.sesssionBackpusher.bind('remote_update', this.pusherDateRecieved);
    },

    start : function (){
        this.model.fetch( {success:this.loadQuestion} );
        this.gameOver = false;
    },

	loadQuestion : function( qNum ) {
		isNaN(parseInt(qNum)) && (qNum = 0);

		if ( qNum != this.model.get("itemNumber")) 
		{
			this.model.set({"itemNumber" : qNum}, {silent: true});
			
			if(qNum < (this.model.get( "game_questions" ).length))
			{
				this.render();
			
				// this must come after at least the first render since its div isn't in the DOM 'til afterward
				if ( !this.timer ) {
					this.timer = new App.Views.TimerView({el:"#timerBar", interval:100});
					this.timer.bind( "complete", this.timerDone );
                    //this.session.pollFetch( {success:this.sessionStateChange}, null, 1, 30000 );
				}
				// re-align to new element (cuz we re-render at each question)
				this.timer.el = $("#timerBar").get(0);
				this.timer.start( this.QUESTION_TIME );


                // this is a workaround to block repeat events
                // until I can figure out how backbone unbinds events.
                // this.choiceSelected = false;
			}
			else
			{
				this.diloGameOver();
			}
			
		}
	   },

	getSessionGameQuestion : function (id, game_questions){
		for (var j = 0; j < game_questions.length; j++)
		{
			if(game_questions[j].id == id)
				return game_questions[j];
		}
		return null;
		
	},

	pusherDateRecieved : function (data){
		console.log(data);
		this.session.set(data);
		this.sessionStateChange();
		
	},

	// session pollfetch listener.  States originating from the server callback to here...
    sessionStateChange : function() {
		console.log(this.model.get("itemNumber") + " of " + this.session.get( "game" ).game_questions.length )
		var timeToWaitBeforeLoadingNextQuestion = 0;
        var qData = this.model.getCurQuestion();
        var gQuestion = this.getSessionGameQuestion(this.model.getCurQuestion().id, this.session.get( "game" ).game_questions);
		qData.currentGameQuestion = gQuestion;		
		var states;
		
		var currentState =  this.session.get( "state" );
		
		if(this.session.get( "current_question" ) != this.model.get("itemNumber"))
			currentState = "won";
		else
			currentState = "";
		
		switch ( currentState ) {
			case "won":
				this.timer.stop();
				
				//location.href = '#gameOver';
				//return;
				
				// HACK
				//qData.winner = this.session.get( "game" ).game_questions[ qData.itemNumber ].winner;
				qData.winner = gQuestion.winner;
				
				if(qData.winner)
				{
					var myID = this.session.myPlayer.id;
					
					var id = $("#answer");
					id[0].style.visibility = "visible";
                    states = {
                        me: {
                            won: qData.winner == myID,
                            score: this.session.myPlayer.get("score"),
                            response : _.last(this.session.myPlayer.get( "responses" )),
							
                        },
                        them: {
                            won: qData.winner != myID,
                            score: this.session.theirPlayer.get("score"),
                            response : _.last(this.session.theirPlayer.get( "responses" )),
						},
                        questionData: qData
                    };
                    //$("#winner").text( states.me.won ? "You won!" : "You lost!" );
                    this.showPlayerStates( states );
                    // wait a bit before loading next question...
				    timeToWaitBeforeLoadingNextQuestion = 2400;
					this.loadQuestion(this.session.get("current_question"));
                }
				break;
			case "timedOut":
                this.timer.stop();
				//TODO: this is where we mark both as losers and advance to next Question
				states = {
                        timedOut:true,
                        me: {
                            won: false,
                            score: this.session.myPlayer.get("score"),
                            response : _.last(this.session.myPlayer.get( "responses" ))
                        },
                        them: {
                            won: false,
                            score: this.session.theirPlayer.get("score"),
                            response : _.last(this.session.theirPlayer.get( "responses" ))
                        },
                        questionData: qData
                };
				timeToWaitBeforeLoadingNextQuestion = 1200;
                this.showPlayerStates( states );
				break;
			case "incorrect":
                states = {
                        timedOut:false,
                        me: {
                            won: false,
                            score: this.session.myPlayer.get("score"),
                            response : _.last(this.session.myPlayer.get( "responses" ))
                        },
                        them: {
                            won: false,
                            score: this.session.theirPlayer.get("score"),
                            response : _.last(this.session.theirPlayer.get( "responses" ))
                        },
                        questionData: qData
                };
                this.showPlayerStates(states);
				break;
            case "nextQuestion":
                this.loadQuestion(this.session.get("current_question"));

                break;
			default:
				//TODO: regardless of who was incorrect, just check players' responses and all are wrong
				// timer does NOT stop, and we don't update the questions (i.e. session.current_question is still same #)
                states = {
                        timedOut:false,
                        me: {
                            won: false,
                            score: this.session.myPlayer.get("score"),
                            response : _.last(this.session.myPlayer.get( "responses" ))
                        },
                        them: {
                            won: false,
                            score: this.session.theirPlayer.get("score"),
                            response : _.last(this.session.theirPlayer.get( "responses" ))
                        },
                        questionData: qData
                };
                this.showPlayerStates(states);

				// immediately start pollfetch again...
				timeToWaitBeforeLoadingNextQuestion = 2400;
				break;
		}
        //this.session.pollFetch( {success:this.sessionStateChange}, null, 1, 300000);
	},
	diloGameOver : function () {
		//$(this.el).html( _.template( $("#gameOverTemplate").html(), this.session ) );
		location.href = '#gameOver';
	},
	
    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this.session ) );
		
		// since different question types each have their own unique rendering logic, we'll separate
		//	the general game view from the question-logic-specific view (i.e. MC, FillInTheBlank, DnD, etc)
        $("#questionArea", $(this.el) ).html( this.renderQuestion() );
		
		// question styling...
		// TODO: these should be implemented into acSelected and showPlayerStates
		$(".answerChoice", $(this.el)).addClass("unselected");
		
		var id = $("#answer");
		id[0].style.visibility = "hidden";
    },

	
    //========= start question-specific logic =============
	QUESTION_TIME : 12000,
	
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
		
    },

	// immediate reaction to UI
    acSelected : function ( ev ){
        // if(!this.choiceSelected)
        // {
            var target = ev.currentTarget;
            var correctIndex = this.model.getCorrectIndex();

            $(target).removeClass("unselected");

            if("choice" + correctIndex != target.id)
                $(target).addClass("player1-incorrect");
            else
                $(target).addClass("player1-correct");

            $(target).siblings(".answerChoice")
                .removeClass("unselected")
                .addClass("disabled");


            this.model.set( {pendingResponse:target.id.substr(target.id.length - 1)}, {silent:true} );
            // in non-MC items (i.e. non single-action items), this will probably save pendingResponse to server

            // this.choiceSelected = true;
            this.submit();
        // }
    },
	
	getPlayerResponses : function ( playerId, gameQuestionId ) {
		var foundResponses = [];	
		var players =  this.session.get("players");
		for (var i = 0; i < players.length; i++)
		{
			if(players[i].id == playerId)
			{
				var responses = players[i].responses;
				for (var j = 0; j < responses.length; j++)
				{
					if(responses[j].game_question_id == gameQuestionId)
					{
						foundResponses.push(responses[j].response_index);
					}
				}
			}
		}
		return foundResponses;
	},
	// reaction to server-returned states
	showPlayerStates : function ( states ) {

        var thingToCheck = this.session.get("state");
		if(states)
		{
		
			var myResponses = this.getPlayerResponses( this.session.myPlayer.id, states.questionData.currentGameQuestion.id );
			var theirResponses = this.getPlayerResponses( this.session.theirPlayer.id, states.questionData.currentGameQuestion.id );
			var correctIndex = this.model.getCorrectIndex();
			
			this.updateResponses(theirResponses, correctIndex);				
		
			if(states.me.won)
				$("#choice" + correctIndex)
                    .removeClass("disabled")
                    .addClass("player1-correct");
			else if(states.them.won)
				$("#choice" + correctIndex)
                    .removeClass("disabled")
                    .addClass("player2-correct");
		
		}
	},
	updateResponses : function (responses, correctIndex){
		for (var j = 0; j < responses.length; j++)
		{
			if(responses[j] != correctIndex)
				$("#choice" + responses[j])
                    .removeClass("disabled")
                    .addClass("player2-incorrect");
			
		}
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
		// TODO: notify of time out!
		// TODO: session should return state "lost" or "timed out"
        // this.session.state.set("timedOut");
        // this.sessionStateChange();
	}	
});