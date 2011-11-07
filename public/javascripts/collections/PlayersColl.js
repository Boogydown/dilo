/**
 * ...
 * @author Hammond
 */
App.Collections.PlayersColl = Backbone.Collection.extend({
	url: "players.json",
	comparator : function(player) { return player.get("score"); }
});