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
	},
	
	setPlayers : function () {
		var players = this.get( "players" );
		if ( _.isArray(players) ) 
		{
			for (var j = 0; j < players.length; j++)
			{
				if(players[j].id != this.myPlayer.id)
				{	
					this.theirPlayer.set( players[j] );
				}	
			}
		}
	},
	
	
	setGameQuestions : function() {
		if ( this.questionsModel )
			this.questionsModel.set( this.get( "game" ) );
	}
	
});

