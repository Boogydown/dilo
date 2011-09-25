/**
 * Created by JetBrains RubyMine.
 * User: Dimitri Hammond
 * Date: 9/12/11
 * Time: 11:50 AM
 * To change this template use File | Settings | File Templates.
 */
App.Views.LoginView = Backbone.View.extend({
    events : { "submit #loginForm" : "sendPlayer" },

    initialize: function (options) {
        _.bindAll(this, "sendPlayer", "playerCreated", "sessionCreated", "syncError");
        this.session = options.session;
        this.model.set({opponentIndex:0});
    },

    render : function() {
        // replace element with contents of processed template
        $(this.el).html( _.template( $("#loginTemplate").html(), this ));
    },

    sendPlayer : function(  ) {
        // model is player; populate name with value taken from input node of id usernameEntry
        this.model.save({
            name:$("#usernameEntry").val()
        },{
            success: this.playerCreated,
            error: this.syncError
        });
        return false;
    },

    playerCreated : function () {
        $("#statusMsg").html("<p>Hello "+ this.model.get("name") + "!  You are player #" + this.model.id +
                             "</p><p>We are pairing you with a partner...</p>");
        this.session.save({
            playerId: this.model.id
        },{
            success: this.sessionCreated,
            error: this.syncError
        });
    },

    sessionCreated : function () {
        var state = this.session.get("state");
        switch ( state ){
            case "waiting" :
                $("#statusMsg").append("<p>Waiting for other player...</p>");
                this.model.set({opponentIndex:1});
                this.session.pollFetch({success:this.sessionCreated, error:this.syncError}, "state", 300, 20000 );
                break;

            case "active" :
                this.opponent = new App.Models.PlayerModel( this.session.get("players")[this.oIndex] );
                $("#statusMsg").html("<p>Paired with player " + this.opponent.get("name") + " with session id " + this.session.id + "!</p>" +
                                     "<p>Click button to start!</p>");
                $("#startGameBtn", this.el).show();
                break;
        }
    },

    syncError : function (model, response) {
        alert("Server failure!\n" + response);
    }
});