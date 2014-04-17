var App = require('app');

App.LoginRoute = Ember.Route.extend({

	// clear a potentially stale error message from previous login attempts
	setupController : function(controller, model) {
		controller.set('errorMessage', null);
	},

	actions : {
		authenticateSession: function() {
			console.debug('authenticateSession');
			this.get('session').authenticate('authenticator:colors', {});
		},
		
		// transition to 'colors' when authentication succeeds
		sessionAuthenticationSucceeded: function() {
			console.debug('sessionAuthenticationSucceeded');
			this.transitionTo('colors');
		},
		
		// display an error when authentication fails
		sessionAuthenticationFailed : function(error) {
			console.debug('sessionAuthenticationFailed');
			this.controller.set('errorMessage', error);
		},
		
		invalidateSession: function() {
			console.debug('invalidateSession');
		},
		
		sessionInvalidationSucceeded: function() {
			console.debug('sessionInvalidationSucceeded');
		},
		
		sessionInvalidationFailed: function(error) {
			console.debug('sessionInvalidationFailed');
		},
		
		authorizationFailed: function() {
			console.debug('authorizationFailed');
		}
	}
});