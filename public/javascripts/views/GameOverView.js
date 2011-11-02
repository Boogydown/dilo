/**
 * User: James Setaro
 */
App.Views.GameOverView = Backbone.View.extend({
	initialize: function (options) {
		_.bindAll(this, "render", "getCorrectChoice", "replay");
		this.session = options.session;
		this.questionsModel = options.questionsModel;
		this.player = this.session.myPlayer;		
	},

	getCorrectChoice : function(choices) 
	{
		for(var i = 0;i < choices.length; i++)
			if(choices[i].correct)
				return choices[i].content;
		return null;		
	},

	render : function() {
		var game_questions = this.session.get("game").game_questions,
			myID = this.session.myPlayer.id,
			distractors = this.questionsModel.get("game_questions"),
			currentQuestion, gameQ, winner,
			myDisplayData = [],
			i = 0;
		//var questions = this.questionsModel.get("questions");
	
		for( ; i < game_questions.length; i++)
		{
			currentQuestion = this.questionsModel.getCurQuestion( i );
			gameQ = game_questions[i];
			switch ( gameQ.winner ) {
				case myID : winner = this.session.myPlayer.get("name") ; break;
				case null : winner = "[nada]" ; break;
				default   : winner = this.session.theirPlayer.get("name"); break;
			}
			
			myDisplayData.push({
				question: currentQuestion.prompt,
				answer: this.getCorrectChoice(distractors[i].multiple_choices),
				winner: winner
			});
		}
		
		// replace element with contents of processed template
		$(this.el).html( _.template( $("#gameOverTemplate").html(), {data:myDisplayData} ));
		$("#replayForm").submit( this.replay );
	},

	replay : function () {
		this.finalize('#home');
	},
	
	finalize : function( href ) {
		// unbind all events
		$("#replayForm").unbind();
		this.session = null;
		this.player = null;
		href && (location.href = href);
	}
	
});