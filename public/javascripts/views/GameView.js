/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    events : {
        "click #choice0" : "acSelected",
        "click #choice1" : "acSelected",
        "click #choice2" : "acSelected",
        "click #choice3" : "acSelected"
    },

    initialize : function (options) {
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", "onGameReturned" );
        this.session = options.session;
        this.player = options.player;
    },

    start : function (){
        this.model.fetch( {success:this.onGameReturned} );
        this.gameOver = false;
    },

    onGameReturned : function() {
        this.model.set({"itemNumber" :this.session.get("current_question"), silent: true});
        this.session.pollFetch( {success:this.sessionStateChange}, "current_question", 1, 60000 );
        this.render();
    },

    sessionStateChange : function() {
        var sessionState = this.session.get( "state" ).split(":");
        if ( sessionState[0] == "won" ){
			var winner = sessionState[1];
			this.setPlayerStates( { 
				me: { 
					won: winner == this.player.name /*,
					response : ____.pendingResponse*/
				},
				opponent: {
					won : winner != this.player.name /*,
					response : ____.pendingResponse*/
				}
			});
            //this.endGame();
        }
		
		//TODO: set timestamp for next question load
		//TODO: create this.loadQuestion( ... to do this:
        this.model.set({"itemNumber" :this.session.get("current_question")}, {silent: true});
        this.render();
        this.session.pollFetch( {success:this.sessionStateChange}, "current_question", 1, 60000 );
    },

    //========= start question-specific logic =============
	QUESTION_TIME : 15000,
    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this ) );
        $("#questionArea", $(this.el) ).html( this.renderQuestion() );
    },

    renderQuestion : function (  ) {
		this.timeStart = new Date().getTime();
		$("#wonMessage",$("#gameQuestionTemplate_MC")).hide();
		$("#lostMessage",$("#gameQuestionTemplate_MC")).hide();
        return _.template( $("#gameQuestionTemplate_MC").html(), this.model.attributes );
    },

    acSelected : function ( ev ){
        var myDiv = ev.currentTarget;
        this.model.set( {pendingResponse:myDiv.id.substr(myDiv.id.length - 1)}, {silent:true} );
        // in non-MC items (i.e. non single-action items), this will probably save pendingResponse to server
        this.submit();
    },
	
	setPlayerStates : function ( states ) {
		if ( states.me.won )
			$("#wonMessage", $("#gameQuestionTemplate_MC")).show();
		else
			$("#lostMessage", $("#gameQuestionTemplate_MC")).show();
	},
    //=========== end question-specific logic ===============

    submit : function (){
        // copy over from pending to submitted...
        var resp = this.model.get( "pendingResponse" );
        this.player.get( "responses" ).push( resp );

        this.player.save({
			"currentGameId": this.session.get("game").id,
			"currentGameQuestion": this.model.get("game_questions")[this.model.get("itemNumber")].id,
			"newResponse": resp,
			"sessionId": this.session.id,
			"time": Math.ceil((this.QUESTION_TIME - (new Date().getTime() - this.timeStart)) / 10),
			"current_question":this.session.get("current_question")
		});
		console.log("sent: " + JSON.stringify(this.player) );
    },
	
/*    onAnswerSaved : function (){
        var correct = this.model.get( "scoreResponse" )(resp, this.model);
        if ( correct && !this.gameOver){
            this.session.poll.stop();
            this.session.save({state:"won:" + this.player.id});
            alert("You won!");
            this.endGame();
        } else {
            alert("Wrong!");
        }
    },
*/
    endGame : function() {
		this.gameOver = true;
		$(this.el).html("<h1>Game Over</h1>");
    }
});