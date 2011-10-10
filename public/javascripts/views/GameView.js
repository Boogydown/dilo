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
        _.bindAll( this, "acSelected","render", "renderQuestion", "sessionStateChange", "onGameReturned", "onAnswerSaved" );
        this.session = options.session;
        this.player = options.player;
    },

    start : function (){
//        var gameModel = new App.Models.PlayerModel({id:this.session.get("game").id});
        this.model.fetch( {success:this.onGameReturned});
        this.gameOver = false;

    },

    onGameReturned : function() {
        this.model.set({itemNumber :this.session.get("current_question"), silent: true});
//        this.session.pollFetch( {success:this.sessionStateChange}, "state", 100, 30000 );
        this.session.pollFetch( {success:this.sessionStateChange}, "current_question", 100, 30000 );

        this.render();
    },


    sessionStateChange : function() {
        var sessionState = this.session.get( "state" ).split(":");
        if ( sessionState[0] == "won" ){
            this.gameOver = true;
            alert( "You lost to " + sessionState[1] );
            this.endGame();
        }

//        if(this.session.get("game").game_questions[0].responses)

//        var changedAttributes = this.session.changedAttributes();
//        if(changedAttributes.game_questions[0].responses.player.id !=  )
        this.model.set({itemNumber :this.session.get("current_question"), silent: true});
        this.session.pollFetch( {success:this.sessionStateChange}, "current_question", 100, 30000 );

//        var itemNumber = this.session.get( "current_question" ).split(":");
        this.render();
    },

    //========= start question-specific logic =============
    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this ) );
        $("#questionArea", $(this.el) ).html( this.renderQuestion() );
    },

    renderQuestion : function (  ) {
        return _.template( $("#gameQuestionTemplate_MC").html(), this.model.attributes );
    },

    acSelected : function ( ev ){
        var myDiv = ev.currentTarget;
        this.model.set( {pendingResponse:myDiv.id.substr(myDiv.id.length - 1)} );
        // in non-MC items (i.e. non single-action items), this will probably save pendingResponse to server
        this.submit();
    },
    //=========== end question-specific logic ===============

    submit : function (){
        // copy over from pending to submitted...
        var resp = this.model.get( "pendingResponse" );
//        this.model.get( "submittedResponses" ).push( resp );
        this.player.get( "responses" ).push( resp );
        //this.player.set("session_id", this.session.id);
        this.player.set({"currentGameId": this.session.get("game").id});

        var question = this.model.get("game_questions")[0].id;
        this.player.set({"currentGameQuestion": question});
        this.player.set({"newResponse": resp});
        this.player.set({"sessionId": this.session.id});

        this.player.save();

    },
     onAnswerSaved : function (){

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
    endGame : function() {
       $(this.el).html("<h1>Game Over</h1>");
    }
});