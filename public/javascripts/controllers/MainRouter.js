/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */

App.Routers.MainRouter = Backbone.Router.extend({
    curView : null,
    mainEl : "#app",
    routes: {
        "home" : "showHome",
        "play" : "showGame"
    },

    intialize : function () {
        _.bindAll( this, "showHome", "showGame");
    },

    showHome : function () {
        ( this.curView = new App.Views.LoginView({ el:this.mainEl }) ).render();
    },

    showGame : function () {
        //TODO: make questions dynamically load
        var sampleQ = new App.Models.QuestionModel({
            stemContent: "Who is the coolest of the Dilo dev team?",
            responseContent: {choices : ["James", "Jason", "Dimitri", "Jonathan"]},
            correctResponse: function (response) {return response == "choice2"}
        });
        ( this.curView = new App.Views.GameView({ el:this.mainEl, model:sampleQ }) ).render();
    }
})