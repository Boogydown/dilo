App.Views.BaseMainView = Backbone.View.extend({
	finalize : function( href ){
		//unbind any previously delegated events
		this.unbind();
		this.delegateEvents();
		href && (location.href = href);
	}
});