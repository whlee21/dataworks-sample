var App = require('app');

App.ColorsRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);

App.ColorsRoute.reopen({
	model : function() {
		console.debug('App.ColorsRoute.model.findAll')
		return App.Color.findAll();
	}
});