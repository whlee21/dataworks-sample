var App = require('app');

App.LoginRoute = Ember.Route.extend({

	// clear a potentially stale error message from previous login attempts
	setupController : function(controller, model) {
		controller.set('errorMessage', null);
	},

	actions : {
		authenticateSession: function() {
			console.debug('LoginRoute.authenticateSession');
			this.get('session').authenticate('authenticator:colors', {});
		},
		
		// transition to 'colors' when authentication succeeds
		sessionAuthenticationSucceeded: function() {
			console.debug('LoginRoute.sessionAuthenticationSucceeded');
			console.debug('session.account');
			this.transitionTo('colors');
		},
		
		// display an error when authentication fails
		sessionAuthenticationFailed : function(error) {
			console.debug('LoginRoute.sessionAuthenticationFailed');
			this.controller.set('errorMessage', error);
		},
		
		invalidateSession: function() {
			console.debug('LoginRoute.invalidateSession');
		},
		
		sessionInvalidationSucceeded: function() {
			console.debug('LoginRoute.sessionInvalidationSucceeded');
		},
		
		sessionInvalidationFailed: function(error) {
			console.debug('LoginRoute.sessionInvalidationFailed');
		},
		
		authorizationFailed: function() {
			console.debug('LoginRoute.authorizationFailed');
		}
	}
});