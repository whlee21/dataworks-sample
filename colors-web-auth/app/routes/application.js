var App = require('app');

App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
	beforeModel: function() {
		this.transitionTo('login');
	},
	
	actions: {
//		authenticateSession: function() {
//			console.debug('authenticateSession');
//			this.get('session').authenticate('authenticator:colors', {});
//		},
//		
//		sessionAuthenticationSucceeded: function() {
//			console.debug('sessionAuthenticationSucceeded');
//		},
//		
//		sessionAuthenticationFailed: function(error) {
//			console.debug('sessionAuthenticationFailed');
//		},
//		
//		invalidateSession: function() {
//			console.debug('invalidateSession');
//		},
//		
//		sessionInvalidationSucceeded: function() {
//			console.debug('sessionInvalidationSucceeded');
//		},
//		
//		sessionInvalidationFailed: function(error) {
//			console.debug('sessionInvalidationFailed');
//		},
//		
//		authorizationFailed: function() {
//			console.debug('authorizationFailed');
//		}
	}
});