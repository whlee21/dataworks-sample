var App = require('app');

App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
	beforeModel: function() {
		this.transitionTo('login');
	}
});