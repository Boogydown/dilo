/**
 * MainRouter routes hash values of the url to different views
 * Created by: HAMMDI on 9/24/11 12:04 PM
 */
App.Routers.MainRouter = Backbone.Router.extend({
    mainEl : "#app",
	
    routes: {
        "" : "showHome",
        "home" : "showHome",
        "play" : "showGame",
		"gameOver" : "showGameOver",
    },

    initialize : function () {
        _.bindAll( this, "showHome", "showGame", "showGame");
    },

	/**
	 * Shows the home/login screen.  All game sessions begin here.
	 */
    showHome : function () {
		if ( this.curView ) 
			this.curView.finalize();
		if ( this.session )
			this.session.finalize();
		if ( this.curQ )
			this.curQ.finalize();
		
		this.curQ = null;
		
        // create the login view and immediately render it
		this.session = new App.Models.SessionModel();		
        (this.curView = new App.Views.LoginView({
            el:this.mainEl,
            model: this.session
        }) ).render();
    },
	
	/**
	 * Once a session is created and has matched players the we can begin the game
	 */
    showGame : function () {
		if ( this.curView ) 
			this.curView.finalize();
		
		// kick back to home screen if no session
        if ( !this.session || this.session.get("state") != "active" ) {
            location.href = "#home";
            return;
        }
		
		// create the game view...
		this.curQ = new App.Models.QuestionModel({id:this.session.get("game").id});
        (this.curView = new App.Views.GameView({
            el: this.mainEl,
            model: this.curQ,
            session: this.session,
            player: this.player,
			opponent: this.opponent

			///...and start it!
        })).start();
    },
	
	showGameOver : function () {
		if ( this.curView ) 
			this.curView.finalize();

		// kick back to home screen if no session
		if ( !this.session || !this.curQ ) {
			location.href = "#home";
			return;
		}
		
		(this.curView = new App.Views.GameOverView({
			el:this.mainEl,
			session: this.session,
			questionsModel: this.curQ
		})).render();
	}
	
});