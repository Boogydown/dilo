/**
 * User: James Setaro
 */
App.Views.GameOverView = Backbone.View.extend({
	events : { "submit #replayForm" : "replay" },

	initialize: function (options) {
		_.bindAll(this, "render", "getCorrectChoice", "replay");
		this.session = options.session;
		this.questionsModel = options.questionsModel;
		this.player = this.session.myPlayer;
		
	},
	getCorrectChoice : function(choices) 
	{
			for(var i =0;i< choices.length; i++)
			{
				if(choices[i].correct)
					return choices[i].content;
			}
			
			return null;
		
	},
	render : function() {
		// replace element with contents of processed template
		$(this.el).html( _.template( $("#gameOverTemplate").html(), this ));
		
		
		$("#results").append("<br/><br/><br/>");
		
		var game_questions = this.session.get("game").game_questions;
		var questions = this.questionsModel.get("questions");
		var distractors = this.questionsModel.get("game_questions");
		
		var myID = this.session.myPlayer.id;
		
		var $wrap = $('<div>').attr('id', 'tableWrap');
		var $tbl = $('<table>').attr('id', 'hor-minimalist-a');
		
		
		
		
		
		$tbl.append($('<thead>').append(
						$('<tr>')
								.append($('<th scope="col">').text("Question"),
										$('<th scope="col">').text("Answer"),
										$('<th scope="col">').text("Winnner")
										)
					   ));
		
		for(var i = 0; i < game_questions.length; i++)
		{
			this.questionsModel.set({"itemNumber" : i}, {silent: true});
			var currentQuestion = this.questionsModel.getCurQuestion();
			
			var gameQ = game_questions[i];
			var question = questions[i];
			
			var winner = this.session.myPlayer.get("name");
			
			
			if(myID != gameQ.winner)
				winner = this.session.theirPlayer.get("name") 
		
			$tbl.append(
						$('<tr>')
								.append($('<td>').text(currentQuestion.prompt),
										$('<td>').text(this.getCorrectChoice(distractors[i].multiple_choices)),
										$('<td>').text(winner)
										)
					   );
		}

		$wrap.append($tbl);
		$('#results').append($wrap);
		
		
		
		
	},

	

	replay : function () {
				
		location.href = '#home';
	},

	sessionCreated : function () {
		var state = this.model.get("state");
		switch ( state ){
			case "waiting" :
				$("#statusMsg").append("<p>Waiting for other player...</p>");
				
				// "waiting" means we were the first to create this session, so we're the [0] player in the session's players array
				this.model.myIndex = 0;
				this.model.pollFetch({success:this.sessionCreated, error:this.syncError}, "state", 300, 60000 );
				break;

			case "active" :
				//$("#statusMsg").html("<p>Paired with player " + this.model.theirPlayer.get("name") + 
				//					 " with session id " + this.model.id + "!</p>" +
				//                     );
									 
				// we don't do myIndex=1 here because regardless of your index you always get an "active" state, so 
				//	everyone's myIndex would be 1.  We, instead, just make this default inside SessionModel
				location.href = '#play';
				break;
		}
	},

	syncError : function (model, response) {
		console.log("Server failure!\n" + response);
	}
});