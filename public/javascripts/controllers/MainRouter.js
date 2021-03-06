/**
 * MainRouter routes hash values of the url to different views
 * Created by: HAMMDI on 9/24/11 12:04 PM
 */
App.Routers.MainRouter = Backbone.Router.extend({
    mainEl : "#app",
	
    routes: {
        "" : "showHome",
        "home" : 				"showHome",			// load the homescreen; start everything from scratch
        "home/:player": 		"showHome",			// load the homescreen and login as :player
        "play" : 				"showGame",
        "play/s:session" : 		"showGame",
		"gameOver" :			"showGameOver",
		"gameOver/s:session" :	"showGameOver",
		"highScores" : 			"showHighScores"
    },

    initialize : function () {
        _.bindAll( this, "showHome", "showGame", "showGame", "bootLoadSession" );
    },

	/**
	 * Shows the home/login screen.  All game sessions begin here.
	 */
    showHome : function ( playerId ) {
		if ( this.curView ) 
			this.curView.finalize();
		if ( this.session )
			this.session.finalize();
		if ( this.curQ )
			this.curQ.finalize();
		this.curQ = null;
		
		// remove /playerId, if it exists
		this.navigate( "#home" );			
		
        // create the login view...
		this.session = new App.Models.SessionModel();		
        (this.curView = new App.Views.LoginView({
            el:this.mainEl,
            model: this.session,
			playerId: playerId
			
		// ...and immediately render it
        })).render();
    },
	
	bootLoadSession : function ( sessionID, callback, loadQuestions ) {
		var s = this.session = new App.Models.SessionModel({id:sessionID});
		
		// load curQ (on session's load success))
		if ( loadQuestions ) {
			var q = this.curQ = new App.Models.QuestionModel();
			callback = function() {
				q.set({id:s.get("game").id});
				q.fetch({
					success: function(){callback();},
					error: function() {alert("Could not find game_questions " + q.id);}
				});
			};
		}

		// load session
		s.fetch({
			success: function(session){
				session.set({
					state: "active",
					current_question: 0
				});
				callback();
			},
			error: function() {
				alert("Could not find session " + sessionID);
			}
		});
	},
	
	/**
	 * Once a session is created and has matched players the we can begin the game
	 */
    showGame : function ( sessionID ) {
		if ( this.curView ) 
			this.curView.finalize();
		this.curView = null;
		
		if ( _.isString(sessionID) && sessionID != "" ){
			this.bootLoadSession( sessionID, this.showGame );
			return;
		}
		
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
	
	showGameOver : function ( sessionID ) {
		if ( this.curView ) 
			this.curView.finalize();

		if ( _.isString(sessionID) && sessionID != "" ) {
			this.bootLoadSession( sessionID, this.showGameOver, true );
			return;
		}

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
	},
	
	showHighScores : function () {
		if ( this.curView ) 
			this.curView.finalize();
		(this.curView = new App.Views.HighScoresView({ 
			el:this.mainEl,
			session: this.session // it's ok if this is null; we're only using it for replay player name
		})).render();
	}
	
});