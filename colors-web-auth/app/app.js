var config = {
    LOG_TRANSITIONS: true, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
    LOG_STACKTRACE_ON_DEPRECATION : true,
    LOG_BINDINGS : true,
    LOG_VIEW_LOOKUPS : true,
    LOG_ACTIVE_GENERATION : true
};

// setup Ember.SimpleAuth in an initializer
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {

	Ember.SimpleAuth.Session.reopen({
		account: function() {
			var accountId = this.get('account_id');
			if (!Ember.isEmpty(account_id)) {
				return container.lookup('store:main').find('account', accountId);
			}
		}
	});
	  
	container.register('authenticator:colors', App.ColorsAuthenticator);
	container.register('authorizer:colors', App.ColorsAuthorizer);
	Ember.SimpleAuth.setup(container, application, App.SimpleAuthOptions);
  }
});

module.exports = Ember.Application.create(config);