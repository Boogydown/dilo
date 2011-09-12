$(function(){
    var PlayerModel = Backbone.Model.extend({
        url : "http://127.0.0.1:3000/players",
        defaults: {
            name:"",
            level:0,
            ranking:0,
            classID:"",
            sessionModelID:""
//            questionModelCollection:

        }
    });

    var LoginView = Backbone.View.extend({
        el: $("#loginDiv"),
        events : { "submit #loginForm" : "sendPlayer",
                   "click #loginDone" : "sendPlayer"},

        initialize: function () {
            _.bindAll(this, "sendPlayer", "playerCreated", "playerError");
            this.el.show();
        },

        sendPlayer : function(  ) {
            this.model = new PlayerModel({name:$("#usernameEntry").val()});
            this.model.save({
                success: this.playerCreated,
                error: this.playerError
            });
            return false;
        },

        playerCreated : function () {
            alert("Success!\nID: " + this.model.id + "\nlevel:" + this.model.level );
        },

        playerError : function (model, response) {
            alert("Failure!\n" + response);
        }
    });

    var app = new LoginView();

})