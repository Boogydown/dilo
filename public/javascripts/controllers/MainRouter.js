/**
 * MainRouter routes hash values of the url to different views
 * Created by: HAMMDI on 9/24/11 12:04 PM
 */
App.Routers.MainRouter = Backbone.Router.extend({
    curView : null,
    mainEl : "#app",
    session: {},
	questionModel:{},
    routes: {
        "" : "showHome",
        "home" : "showHome",
        "play" : "showGame",
		"gameOver" : "showGameOver",
		"replay" : "replay"
		
    },

    initialize : function () {
        _.bindAll( this, "showHome", "showGame", "showGame");
        this.session = new App.Models.SessionModel();
    },

    showHome : function () {
        // create the login view and immediately render it
		//this.session = new App.Models.SessionModel();
		
        ( this.curView = new App.Views.LoginView({
            el:this.mainEl,
            model: this.session
        }) ).render();
    },
	
	replay : function () {
		this.session = new App.Models.SessionModel();
		( this.curView = new App.Views.LoginView({
			el:this.mainEl,
			model: this.session
		}) ).render();
		
	},

	
    showGame : function () {
        if ( this.session && this.session.get("state") != "active" ) {
            location.href = "#home";
            return;
        }
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
    },
	showGameOver : function () {
		( 
			this.curView = new App.Views.GameOverView({
			el:this.mainEl,
			session: this.session,
			questionsModel: this.curView.model
		}) ).render();
	},
	
});