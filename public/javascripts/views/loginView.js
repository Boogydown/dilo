/**
 * Created by JetBrains RubyMine.
 * User: Dimitri Hammond
 * Date: 9/12/11
 * Time: 11:50 AM
 * To change this template use File | Settings | File Templates.
 */
App.Views.LoginView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, "sendPlayer", "playerCreated", "sessionCreated", "syncError");
		this.bootLoadPlayer = options.playerId || "";
    },

    render : function() {
        // replace element with contents of processed template
        $(this.el).html( _.template( $("#loginTemplate").html(), this ));
		
		// if init'd with playerid, then auto-login using that
		if ( this.bootLoadPlayer ) {
			$("#usernameEntry").val( this.bootLoadPlayer );
			this.sendPlayer();
		} else
			$("#loginForm").submit( this.sendPlayer );		
    },

    sendPlayer : function(  ) {
		var username = $("#usernameEntry").val();
		if ( !username ) return alert( "Name cannot be empty!" );
		console.log( username );

		// model is player; populate name with value taken from input node of id usernameEntry
        this.model.myPlayer.save({
            //id: username,
            name: username
        },{
            success: this.playerCreated,
            error: this.syncError
        });
        return false;
    },

    playerCreated : function () {
        $("#loginInputs").css('display','none')
		$("#statusMsg").html("<p>Hello "+ this.model.myPlayer.get("name") + "!</p><p>We are pairing you with a partner...</p>");
        
		var opts = {
		  lines: 12, // The number of lines to draw
		  length: 7, // The length of each line
		  width: 4, // The line thickness
		  radius: 10, // The radius of the inner circle
		  color: '#000', // #rgb or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false // Whether to render a shadow
		};
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);
		
		this.model.save({
            playerId: this.model.myPlayer.id
        },{
            success: this.sessionCreated,
            error: this.syncError
        });
    },

    sessionCreated : function () {
		$('#loginForm').hide();
        var state = this.model.get("state");
        switch ( state ){
            case "waiting" :
                $("#statusMsg").append("<p>Waiting for other player...</p>");
				
				// "waiting" means we were the first to create this session, so we're the [0] player in the session's players array
				this.model.pollFetch({success:this.sessionCreated, error:this.syncError}, "state", 300, 60000 );
                break;

            case "active" :
                //$("#statusMsg").html("<p>Paired with player " + this.model.theirPlayer.get("name") + 
				//					 " with session id " + this.model.id + "!</p>" +
                //                     );
				this.finalize("#play");
                break;
        }
    },

    syncError : function (model, response) {
		console.log("Server failure!\n" + response);
    },
	
	finalize : function( href ) {
		// unbind all delegated events
		$("#loginForm").unbind();		
		this.model = null;
		href && (location.href = href);
	}
});