App.Models.SessionModel = App.Models.PollModel.extend({
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
		_.bindAll( this, "setPlayers" );
		this.bind( "change:players", this.setPlayers );
        this.myPlayer = new App.Models.PlayerModel();
        this.theirPlayer = new App.Models.PlayerModel();
	},

	// whenever session comes back it has updated player info, so let's set them every change
	setPlayers : function () {
		var players = this.get( "players" ), myIndex;
		if ( _.isArray(players) && players.length == 2 ) 
		{
			// figure out which one is me, and then set both respectively
			myIndex = ( players[0].id == this.myPlayer.id ) ? 0 : 1; 			
			this.myPlayer.set( players[ myIndex ] )
			this.theirPlayer.set( players[ 1 - myIndex ] );
		}
	},

	finalize : function() {
		this.unbind();
		this.myPlayer = null;
		this.theirPlayer = null;
		this.clear();
	}
});

