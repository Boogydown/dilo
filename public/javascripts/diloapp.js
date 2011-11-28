var App = {
    Models: {},
    Views: {},
    Collections: {},
    Routers: {},
    init: function() {
		$.fx.step.textShadowBlur = function(fx) {
		  $(fx.elem).css({textShadow: '0 0 ' + Math.floor(fx.now) + 'px black'});
		};		
        new App.Routers.MainRouter();
        Backbone.history.start();
    }
};