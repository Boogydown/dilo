/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    initialize : function (options) {
		if ( this.pusher ) this.finalize();
		
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", 
						 "loadQuestion", "diloGameOver", "pusherDataRecieved", 
						 "timerDone", "renderCountIn", "waitTimerDone" );
        this.session = options.session;

		// !!!!!!!! Don't include in production !!!!!!!!!!!!!!!
		// Enable pusher logging
		Pusher.log = function(message) {
		  if (window.console && window.console.log) window.console.log(message);
		};
		// Flash fallback logging - don't include this in production
		WEB_SOCKET_DEBUG = true;
		// !!!!!!!! !!!!!!!!!!!!!!!!!!!!!!!!!!! !!!!!!!!!!!!!!!
		
		this.pusher = new Pusher('adfabbe2548895aaece0');
		this.pusher.subscribe('player-channel' + this.session.id).bind('session-updated', this.pusherDataRecieved); 
    },

    start : function (){
        this.model.fetch( {success:this.renderCountIn} );
    },

	renderCountIn : function () {
		// count-in overlays basic game template (no question rendered yet)
		$(this.el).html( _.template( $("#gameTemplate").html(), this.session ) );
		$("#timerBar").hide();
		
		this.waitTimer = new App.Views.WaitTimerView({el:"#waiter", interval:100});
		this.waitTimer.bind( "complete", this.waitTimerDone );
		this.waitTimer.start( 3000 );
	},

	waitTimerDone : function (){
		this.waitTimer.unbind();
		this.waitTimer = null;
		this.loadQuestion();
	},	
	
	loadQuestion : function( qNum ) {
		isNaN(parseInt(qNum)) && (qNum = this.session.get("current_question"));

		if ( qNum != this.model.get("itemNumber")) 
		{
			this.model.set({"itemNumber" : qNum}, {silent: true});
			
			if(qNum < (this.model.get( "game_questions" ).length))
			{
				this.render();
				
				// we'll just create a new timer each question; doesn't cost much
				$("#timerBar").show();
				this.timer = new App.Views.TimerView({el:"#timerBar", interval:100});
				this.timer.bind( "complete", this.timerDone );
				this.timer.start( this.QUESTION_TIME );
			}
			else
			{
				this.diloGameOver();
			}
		}
	},
	
	// timed out!
	timerDone : function (){
		this.timer.unbind();
		this.timer = null;
		var qData = this.model.getCurQuestion();
		this.session.myPlayer.save({
			currentGameId: this.session.get("game").id,
			currentGameQuestion: qData.id,
			newResponse: null,
			sessionId: this.session.id,
			time: -1,
			current_question:this.session.get("current_question")
		});	
	},	
	
	////////////////////// BEGIN external message processing ////////////////////////////
	pusherDataRecieved : function (data){
		console.log(data);
		if ( data.id == this.session.id ) {
			this.session.set(data);
			this.sessionStateChange();
		}
	},

	// session pollfetch listener.  States originating from the server callback to here...
    sessionStateChange : function() {
		console.log(this.model.get("itemNumber") + " of " + this.session.get( "game" ).game_questions.length )

        var qData = this.model.getCurQuestion(),
			gQuestion = this.getSessionGameQuestion(qData.id, this.session.get( "game" ).game_questions),
			currentQTest = function(resp){return resp.game_question_id == gQuestion.id;},
			pacingTime = 0,
			curQ = this.session.get( "current_question" );
			
		qData.currentGameQuestion = gQuestion;
		qData.winner = gQuestion.winner;
				
		var states = {
				timedOut:false,
				me: {
					won: qData.winner == this.session.myPlayer.id,
					score: this.session.myPlayer.get("score"),
					responses : _.filter(this.session.myPlayer.get( "responses" ), currentQTest)
								 .map(function(resp){return resp.response_index;})
				},
				them: {
					won: qData.winner == this.session.theirPlayer.id,
					score: this.session.theirPlayer.get("score"),
					responses : _.filter(this.session.theirPlayer.get( "responses" ), currentQTest)
								 .map(function(resp){return resp.response_index;})
				},
				questionData: qData
		};
		this.showPlayerStates(states);
				
		//ignore any messages from a past game(for instance a timer goes off for both players at roughly the same time)
		if( curQ > this.model.get("itemNumber"))
		{	
			if ( this.timer ) {
				this.timer.stop();
				this.timer.unbind();
				this.timer = null;
			}
			switch ( this.session.get( "message" ) ) {
				case "won":
					if(qData.winner)
						pacingTime = 2400;
					break;
				case "timedOut":
				case "bust":
				default:
					pacingTime = 2400;
					break;
			}
			
			if( curQ >= this.model.get( "game_questions" ).length)
				this.diloGameOver();
			else if ( pacingTime )
				setTimeout( this.renderCountIn, pacingTime );
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

	diloGameOver : function () {
		//$(this.el).html( _.template( $("#gameOverTemplate").html(), this.session ) );
		this.finalize('#gameOver');
	},
	
    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this.session ) );
		
		// since different question types each have their own unique rendering logic, we'll separate
		//	the general game view from the question-logic-specific view (i.e. MC, FillInTheBlank, DnD, etc)
        this.renderQuestion( $("#questionArea", $(this.el)) );		
    },
	
    //========= start question-specific logic =============
	QUESTION_TIME : 12000,
	
	// render multiple-choice-specific question logic
    renderQuestion : function ( questionEl ) {
        questionEl.html(_.template( $("#gameQuestionTemplate_MC").html(), this.model.getCurQuestion() ));

		// question styling...
		$(".answerChoice", $(this.el)).addClass("unselected");
		$("#answer").hide("fast");
        $("#choice0").click(this.acSelected);
        $("#choice1").click(this.acSelected);
        $("#choice2").click(this.acSelected);
        $("#choice3").click(this.acSelected);
	},

	// immediate reaction to UI
    acSelected : function ( ev ){
		var target = ev.currentTarget;
		var correctIndex = this.model.getCorrectIndex();

		$(target).removeClass("unselected");
		
		// mark my choice if incorrect...
		if("choice" + correctIndex != target.id)
			$(target).addClass("player1-incorrect");
			
		//else don't mark it correct because they /could/ beat you...
			//$(target).addClass("player1-correct");
			
		// ...and disable others
		$(target).siblings(".answerChoice")
			.removeClass("unselected")
			.addClass("disabled");
		

		this.model.set( {
			responseContent: target.textContent,
			pendingResponse: target.id.substr(target.id.length - 1)
		}, {silent:true} );
		
		this.submit();
    },
	
	// reaction to server-returned states
	showPlayerStates : function ( states ) 
	{
		if(states)
		{
			var correctIndex = this.model.getCorrectIndex();
						
			this.markIncorrects(states.them.responses, correctIndex, "player2-");
			// this is mostly useful in case both players choose wrong; we want both to show, us over them
			this.markIncorrects(states.me.responses, correctIndex, "player1-");
		
			$("#answer").show();			
			if(states.me.won)
				$("#choice" + correctIndex)
                    .removeClass("disabled")
                    .addClass("player1-correct");
			else if(states.them.won)
				$("#choice" + correctIndex)
                    .removeClass("disabled")
                    .addClass("player2-correct");
			else 
				$("#answer").hide();				
		}
	},
	
	markIncorrects : function (responses, correctIndex, prefix){
		for (var j = 0; j < responses.length; j++)
		{
			if(responses[j] != correctIndex)
				$("#choice" + responses[j])
                    .removeClass("disabled")
                    .addClass(prefix + "incorrect");			
		}
	},
	
    //=========== end question-specific logic ===============

    submit : function (){
        // copy over from pending to submitted...
        var resp = this.model.get( "pendingResponse" );
        this.session.myPlayer.get( "responses" ).push( resp );
		var myTime = this.timer ? this.timer.getTime() : null;
		var qData = this.model.getCurQuestion();
        this.session.myPlayer.save({
			currentGameId: this.session.get("game").id,
			currentGameQuestion: qData.id,
			newResponse: resp,
			sessionId: this.session.id,
			time: myTime,
			responseContent: this.model.get("responseContent"),
			current_question:this.session.get("current_question")
		});
		console.log("sent: " + JSON.stringify(this.session.myPlayer) );
    },
	
	finalize : function ( href ){
		if ( this.pusher ) {
			this.pusher.disconnect();
			this.pusher.unsubscribe('player-channel' + this.session.id);
			this.pusher = null;
		}
        $("#choice0").unbind();
        $("#choice1").unbind();
        $("#choice2").unbind();
        $("#choice3").unbind();
		this.session = null;
		href && (location.href = href);
	}
});