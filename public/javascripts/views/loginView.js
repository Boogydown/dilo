/**
 * Created by JetBrains RubyMine.
 * User: Dimitri Hammond
 * Date: 9/12/11
 * Time: 11:50 AM
 * To change this template use File | Settings | File Templates.
 */
App.Views.LoginView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, "sendPlayer", "playerCreated", "sessionCreated", "syncError" );
		this.bootLoadPlayer = options.playerId || "";
    },

    render : function() {
        // replace element with contents of processed template
        $(this.el).html( _.template( $("#loginTemplate").html(), this ));
		var sessions = new App.Collections.SessionsColl();
		sessions.bind( "reset", this.sessionsFetched );
		sessions.fetch();
		
		// if init'd with playerid, then auto-login using that
		if ( this.bootLoadPlayer ) {
			$("#usernameEntry").val( this.bootLoadPlayer );
			this.sendPlayer();
		} else
			$("#loginForm").submit( this.sendPlayer );

        $("#loginDone").mousedown(function()
        {
            $(this).removeClass("loginUp");
            $(this).addClass("loginDown");
        });

         $("#loginDone").mouseup(function()
        {
            $(this).removeClass("loginDown");
            $(this).addClass("loginUp");
        });

        $("#viewHighScores").mousedown(function()
        {
            $(this).removeClass("highScoresUp");
            $(this).addClass("highScoresDown");
        });

         $("#viewHighScores").mouseup(function()
        {
            $(this).removeClass("highScoresDown");
            $(this).addClass("highScoresUp");
        });
    },

	sessionsFetched : function( sessionsColl ) {
		$("#numPlayers").text( (sessionsColl.numPlayers) + " people are playing now!" );
		sessionsColl.unbind();
		delete sessionsColl;
	},
	
    sendPlayer : function(  ) {
		var username = $("#usernameEntry").val();
		if ( !username ) return alert( "Name cannot be empty!" );
		
		
		$("#usernameEntry").attr("disabled", true);
		$('#loginDone').attr("disabled", true);
		
		console.log( "Player " + username + " logging in.");
		
		$("#helloMsg").html("<p><br/>Hello "+ username + "!");
		$("#statusMsg").html("Finding your partner now...")
		//<br/>We are pairing you with a partner...</p>");
   		
		$("#loginInputs").hide();
		
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
		
		
		this.model.myPlayer.save({
			name: username
		},{
			success: this.playerCreated,
			error: this.syncError
		});
        return false;
		
    },

    playerCreated : function () {
        
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
                //$("#statusMsg").append("<p>Waiting for other player...</p>");
				
				// "waiting" means we were the first to create this session, so we're the [0] player in the session's players array
				this.model.pollFetch({success:this.sessionCreated, error:this.syncError}, "state", 300, 60000 );
                break;

            case "active" :
				this.finalize("#play");
                break;
        }
    },

    syncError : function (model, response) {
		if ( model.poll && model.poll.timedout ) {
			if ( confirm("Did not find a player yet!  Would you like to keep trying?") )
				location.href="#home/" + this.model.myPlayer.get("name");
			else
				location.href="/";
		} else
			console.log("Server failure!  Could not pair you. :(\n" + response);
    },
	
	finalize : function( href ) {
		// unbind all delegated events
		$("#loginForm").unbind();		
		this.model = null;
		href && (location.href = href);
	}
});