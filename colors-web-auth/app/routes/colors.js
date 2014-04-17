var App = require('app');

App.ColorsRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
//	beforeModel: function(transition) {
//		
//	},
	
	model : function() {
		console.debug('App.ColorsRoute.model.findAll')
		
		return new Ember.RSVP.Promise(function(resolve, reject) {
			resolve(App.Color.findAll());			
		});
	}	
});