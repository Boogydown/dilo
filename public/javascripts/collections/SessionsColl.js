/**
 * ...
 * @author Hammond
 */
App.Collections.SessionsColl = Backbone.Collection.extend({
	url: "sessions.json",
	//model: App.Models.SessionModel,
	initialize: function() {
		this.numPlayers = 0;
		this.bind( "reset", this.updateCounts );
	},
		
	updateCounts: function(coll) {
		coll.each( function(model) {
			var state = model.get( "state" );
			if ( state != "waiting" && state != "over" )
				coll.numPlayers += 2;
		});
	}
});