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
    }
});
