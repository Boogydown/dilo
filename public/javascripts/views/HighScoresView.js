/**
 * User: Dimitri Hammond
 */
App.Views.HighScoresView = Backbone.View.extend({
	initialize : function(options) {
		_.bindAll( this, "replay", "finalize" );
		this.players = new App.Collections.PlayersColl();
		this.session = options.session;
	},
	
	render : function() {
		// replace element with contents of copied template
		$(this.el).html( $("#highScoresTemplate").html() );
		if ( this.session ) $("#usernameEntry").val( this.session.myPlayer.get("name") );
		$("#replayForm").submit( this.replay );
		this.players.bind("reset", this.renderTable);
		this.players.fetch();
	},
	
	renderTable: function( playerColl ) {
		var startIndex = playerColl.length - 10;
		if ( startIndex < 0 ) startIndex = 0;
		playerColl.chain().rest(startIndex).each( function ( player ){
			$("#highScoreTable").prepend( "<tr class='highscore-row'><td>" + player.get("name") + "</td><td>" + player.get("score") + "</td></tr>" );
		});
	},

	replay : function () {
		this.finalize('#home/' + $("#usernameEntry").val());
	},
	
	finalize : function( href ) {
		// unbind all events
		$("#replayForm").unbind();
		if ( this.players ) 
			this.players.unbind();
		this.players = null;
		href && (location.href = href);
	}
	
});