App.Models.QuestionModel = App.Models.PollModel.extend({
//    url : "http://127.0.0.1:3000/questions",
    railsModel : "games",
    defaults : {
        userID: "",
        stemContent: {},
        responseContent: {},
        correctResponse: "",
        scoreResponse: function(response, context){return context.get("pendingResponse") == context.get("correctResponse");},
        pendingResponse: "",
        submittedResponses: [],
        game_questions: []
    },

    initialize : function() {
        // we want to use a new array, not the static one kept in defaults
        this.set( {submittedResponses : []} );
    },
	
	getCurQuestion : function() {
		var itemNum = this.get("itemNumber");
		var questions = this.get("questions");
		var gquestion = this.get("game_questions")[itemNum];
		return { 
			id: gquestion.id,
			itemNumber: itemNum /* + 1 - 1 */,
			totalQuestions: questions.length,
			prompt: questions[itemNum].prompt, 
			choices: gquestion.multiple_choices, 
			answer: questions[itemNum].answer,
			winner: gquestion.winner,
			winnerScore: gquestion.winner_score,
			prompt_image: questions[itemNum].prompt_image
			
		};
	},
	getCorrectIndex : function() 
	{
			var choices = this.getCurQuestion().choices;
			for(var i =0;i< choices.length; i++)
			{
				if(choices[i].correct)
					return i
			}
			
			return -1;
		
	}
	
});
