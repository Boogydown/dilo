/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    initialize : function (options) {
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", "loadQuestion", "diloGameOver", "getPlayerResponses", "pusherDateRecieved", "timerDone", "renderCountIn", "waitTimerDone" );
        this.session = options.session;
		this.session.questionsModel = this.model;
		this.session.setPlayers();
		this.player = this.session.myPlayer;
		this.timerWaiter = null;
		// Enable pusher logging - don't include this in production
		Pusher.log = function(message) {
		  if (window.console && window.console.log) window.console.log(message);
		};

		// Flash fallback logging - don't include this in production
		WEB_SOCKET_DEBUG = true;

		var pusher = new Pusher('adfabbe2548895aaece0');
		var channel = pusher.subscribe('player-channel' + this.session.id);
		channel.bind('session-updated', this.pusherDateRecieved); 

    },

    start : function (){
        this.model.fetch( {success:this.renderCountIn} );
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
				$("#timerBar").show();
			
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
		var timeToWaitBeforeLoadingNextQuestion = 2400;
        var qData = this.model.getCurQuestion();
        var gQuestion = this.getSessionGameQuestion(this.model.getCurQuestion().id, this.session.get( "game" ).game_questions);
		var states;
		var currentState =  this.session.get( "state" );
		
		qData.currentGameQuestion = gQuestion;		
		qData.winner = gQuestion.winner;
		
				
		states = {
				timedOut:false,
				me: {
					won: qData.winner == this.session.myPlayer.id,
					score: this.session.myPlayer.get("score"),
					response : _.last(this.session.myPlayer.get( "responses" ))
				},
				them: {
					won: qData.winner == this.session.theirPlayer.id,
					score: this.session.theirPlayer.get("score"),
					response : _.last(this.session.theirPlayer.get( "responses" ))
				},
				questionData: qData
		};
		this.showPlayerStates(states);
		
		
		//ignore any messages from a past game(for instance a timer goes off for both players at roughly the same time)
		if(this.session.get( "current_question" ) > this.model.get("itemNumber"))
		{	
			var message = this.session.get( "message" );
			this.timer.stop();
			switch ( message ) {
			case "won":
				if(qData.winner)
				{
					var id = $("#answer");
					id[0].style.visibility = "visible";
					this.timerWaiter = setTimeout( this.renderCountIn, timeToWaitBeforeLoadingNextQuestion, this.session.get("current_question") );	
				}
				break;
			case "timedOut":
				this.timerWaiter = setTimeout( this.renderCountIn, timeToWaitBeforeLoadingNextQuestion, this.session.get("current_question") );	
				break;
			case "bust":
				this.timerWaiter = setTimeout( this.renderCountIn, timeToWaitBeforeLoadingNextQuestion, this.session.get("current_question") );	
				break;
			default:
				timeToWaitBeforeLoadingNextQuestion = 2400;
				break;
		}
			
		}
		else
		{	
			currentState = "";
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

	renderCountIn : function () {
		// replace element with contents of template processed with the questionModel data
		
		$(this.el).html( _.template( $("#gameTemplate").html(), this.session ) );
		$("#timerBar").hide();
		
		var waitTime = $("#waitTime");
		var waiter = $("#waiter");
		
		//$("#questionArea", $(this.el) ).html( _.template( $("#waitTime").html(), this.model ) );
		
		this.waitTimer = new App.Views.WaitTimerView({el:"#waiter", interval:10});
		this.waitTimer.bind( "complete", this.waitTimerDone );
		// re-align to new element (cuz we re-render at each question)
		this.waitTimer.el = $("#waiter").get(0);
		this.waitTimer.start( 3000 );
		
		
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

			this.model.set( {responseContent: target.textContent}, {silent:true} );
			
            this.model.set( {pendingResponse:target.id.substr(target.id.length - 1)}, {silent:true} );
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
			"responseContent": this.model.get("responseContent"),
			"current_question":this.session.get("current_question")
		});
		console.log("sent: " + JSON.stringify(this.session.myPlayer) );
    },
	
	waitTimerDone : function (){
		this.loadQuestion(this.session.get("current_question"));
	},	
	timerDone : function (){
		var qData = this.model.getCurQuestion();
		this.session.myPlayer.save({
			"currentGameId": this.session.get("game").id,
			"currentGameQuestion": qData.id,
			"newResponse": null,
			"sessionId": this.session.id,
			"time": -1,
			"current_question":this.session.get("current_question")
		});
		
		
	}	
});