App.Models.SessionModel = App.Models.PollModel.extend({
    //url : "http://127.0.0.1:3000/sessions",
    railsModel : "sessions",
    defaults : {
        players : null,
        playerId : "",
        questionLogic : null,
        questionsCollection : null,
        current_question : 0,
        state : "waiting",
        final_response : null,
        game: {
            id:0,
            game_questions:[]
        }
    },
	
	initialize : function ( options ) {
		_.bindAll( this, "setPlayers", "setGameQuestions" );
        this.myPlayer = new App.Models.PlayerModel();
        this.theirPlayer = new App.Models.PlayerModel();
		this.questionsModel = options.questionsModel;
		this.myIndex = 1;
		this.bind( "change:players", this.setPlayers );
		//this.bind( "change:game", this.setGameQuestions );
	},
	
	setPlayers : function () {
		var players = this.get( "players" );
		if ( _.isArray(players) && players.length > 1 ) {
			// when session comes back from the server it has some player info, so
			//	we'll apply some of the values to our players' models
			this.myPlayer.set( players[this.myIndex] );
			this.theirPlayer.set( players[1 - this.myIndex] );
		}
	},
	
	setGameQuestions : function() {
		if ( this.questionsModel )
			this.questionsModel.set( this.get( "game" ) );
	}
	
});

