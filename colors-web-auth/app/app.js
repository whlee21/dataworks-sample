var config = {
    LOG_TRANSITIONS: true, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
    LOG_STACKTRACE_ON_DEPRECATION : true,
    LOG_BINDINGS : true,
    LOG_VIEW_LOOKUPS : true,
    LOG_ACTIVE_GENERATION : true
};


var ColorsAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
	authenticate : function(credentials) {
		console.debug('ColorsAuthenticator.authenticate()');
		return new Ember.RSVP.Promise(function(resolve, reject) {
			App.ajax.send({
				name : 'router.authentication',
				sender : this,
				success : 'onAuthenticationSuccess',
				error : 'onAuthenticationError'
			});
		});
	},

	onAuthenticationSuccess : function(data) {
//		this.set('loggedIn', true);
		console.debug('ColorsAuthenticator.onAuthenticationSuccess');
	},
	
	onAuthenticationError : function(data) {
		console.debug('ColorsAuthenticator.onAuthenticationError');
		if (data.status === 403) {
//			this.set('loggedIn', false);
			console.debug('statusCode = 403');
		} else {
			console.log('error in ColorsAuthenticator');
		}
	}
});

var ColorsAuthorizer =  Ember.SimpleAuth.Authorizers.Base.extend({
	authorize: function(jqXHR, requestOptions) {
		console.debug('ColorsAuthorizer.authorize()');
		return null;
	}
});

// setup Ember.SimpleAuth in an initializer
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
//	  Ember.SimpleAuth.setup(container, application);
	container.register('authenticator:colors', ColorsAuthenticator);
	container.register('authorizer:colors', ColorsAuthorizer);
	Ember.SimpleAuth.setup(container, application, {
    	authorizerFactory: 'authorizer:colors'
    });
  }
});

module.exports = Ember.Application.create(config);