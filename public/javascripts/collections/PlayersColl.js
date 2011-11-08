/**
 * ...
 * @author Hammond
 */
App.Collections.PlayersColl = Backbone.Collection.extend({
	url: "players.json",
	model: App.Models.PlayerModel,
	comparator : function(player) { return player.get("score"); }
});