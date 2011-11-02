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
	
	/**
	 * Retrieves a nice object full of useful info about the current question
	 * OR, alternatively, pass in a question # and we'll retrieve info for that one
	 */
	getCurQuestion : function( itemNum ) {
		(itemNum !== undefined) || (itemNum = this.get("itemNumber"));
		//var questions = this.get("questions");
		var gquestions = this.get("game_questions");
			gquestion = gquestions[itemNum];
		return { 
			id: gquestion.id,
			itemNumber: itemNum /* + 1 - 1 */,
			totalQuestions: gquestions.length,
			prompt: gquestion.gprompt, 
			choices: gquestion.multiple_choices, 
			answer: gquestion.ganswer,
			winner: gquestion.winner,
			winnerScore: gquestion.winner_score,
			prompt_image: null//questions[itemNum].prompt_image
		};
	},
	
	getCorrectIndex : function() 
	{
		var choices = this.getCurQuestion().choices, 
			i = 0;
		for( ;i < choices.length; i++)
			if(choices[i].correct)
				return i
		return -1;	
	},

	finalize : function() {
		this.unbind();
		this.clear();
	}
});
