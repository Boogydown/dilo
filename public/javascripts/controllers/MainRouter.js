/**
 * MainRouter routes hash values of the url to different views
 * Created by: HAMMDI on 9/24/11 12:04 PM
 */
App.Routers.MainRouter = Backbone.Router.extend({
    curView : null,
    mainEl : "#app",
    session: {},
    routes: {
        "" : "showHome",
        "home" : "showHome",
        "play" : "showGame"
    },

    initialize : function () {
        _.bindAll( this, "showHome", "showGame");
        this.session = new App.Models.SessionModel();
    },

    showHome : function () {
        // create the login view and immediately render it
        ( this.curView = new App.Views.LoginView({
            el:this.mainEl,
            model: this.session
        }) ).render();
    },

    showGame : function () {
        if ( this.session && this.session.get("state") != "active" ) {
//            alert("You must login and pair up, first!");
            location.href = "#home";
            return;
        }

        // some basic, hard-coded question
//        var sampleQ = new App.Models.QuestionModel({
//            stemContent: {prompt:"Who is the coolest of the Dilo dev team?"},
//            responseContent: {choices : ["James", "Jason", "Dimitri", "Jonathan"]},
//            correctResponse: 2
//        });

        // create the game view...
        this.curView = new App.Views.GameView({
            el: this.mainEl,
            model: new App.Models.QuestionModel({id:this.session.get("game").id}),
            session: this.session,
            player: this.player,
			opponent: this.opponent
        });

        ///...and start it!
        this.curView.start();
    }
});