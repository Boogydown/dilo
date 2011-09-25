var App = {
    Models: {},
    Views: {},
    Collections: {},
    Routers: {},
    init: function() {
        new App.Routers.MainRouter();
        Backbone.history.start();
    }
};