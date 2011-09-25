/**
 * Created by JetBrains RubyMine.
 * User: HAMMDI
 * Date: 9/24/11
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
App.Views.GameView = Backbone.View.extend({
    events : {
        "click#choice0" : "acSelected",
        "click#choice1" : "acSelected",
        "click#choice2" : "acSelected",
        "click#choice3" : "acSelected"
    },

    initialize : function () {
        _.bindAll( this, "acSelected", "renderQuestion");
    },

    render : function () {
        // replace element with contents of template processed with the questionModel data
        $(this.el).html( _.template( $("#gameTemplate").html(), this ) );
    },

    renderQuestion : function () {
        return _.template( $("#questionTemplate_MC").html(), this.model.attributes );
    },

    acSelected : function ( myDiv ){
        this.set( {pendingResponse:myDiv.id.substr(0, myDiv.id.length - 1)} );
        this.submit();
    },

    submit : function (){
        var resp = this.model.get( "pendingResponse" );
        this.submittedResponses.push( resp );
        alert("Selected: " + resp +  "\n" +
              "This is " + ( this.model.scoreResponse(resp, this.model) ? "correct" : "incorrect" ) );
    }
})