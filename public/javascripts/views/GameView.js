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
        _.bindAll( this, "acSelected", "renderQuestion", "sessionStateChange" );
        this.session = options.session;
        this.player = options.player;
    },

    start : function (){
        this.gameOver = false;
        this.session.pollFetch( {success:this.sessionStateChange}, "state", 100, 30000 );
        this.render();
    },

    sessionStateChange : function() {
        var sessionState = this.session.get( "state" ).split(":");
        if ( sessionState[0] == "won" ){
            this.gameOver = true;
            alert( "You lost to " + sessionState[1] );
            this.endGame();
        }
    },

    //========= start question-specific logic =============
    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this ) );
        $("#questionArea", $(this.el) ).html( this.renderQuestion() );
    },

    renderQuestion : function (  ) {
        return _.template( $("#questionTemplate_MC").html(), this.model.attributes );
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
        this.model.get( "submittedResponses" ).push( resp );
        // score it and notify the server
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