var config = {
    LOG_TRANSITIONS: true, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
    LOG_STACKTRACE_ON_DEPRECATION : true,
    LOG_BINDINGS : true,
    LOG_VIEW_LOOKUPS : true,
    LOG_ACTIVE_GENERATION : true
};


var ColorsAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
	
	tokenEndpoint: '/api/v1/session',

	restore : function(data) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			if (!Ember.isEmpty(data.token)) {
				resolve(data);
			} else {
				reject();
			}
		});
	},

	authenticate : function(credentials) {
		var _this = this;

		var loginName = credentials.identification.toLowerCase();
		var hash = window.btoa(loginName + ":" + credentials.password);
		var usr = '';

		if (App.testMode) {
			if (loginName === "admin"
					&& credentials.password === 'admin') {
				usr = 'admin';
			} else if (loginName === 'user'
					&& credentials.password === 'user') {
				usr = 'user';
			}
		}

		return new Ember.RSVP.Promise(function(resolve, reject) {
			App.ajax.send({
				name : 'router.login',
				sender : _this,
				data : {
					auth : "Basic " + hash,
					usr : usr,
					loginName : loginName
				},
				beforeSend : 'authBeforeSend',
				success : 'loginSuccessCallback',
				error : 'loginErrorCallback'
			});
		});
	},

	authBeforeSend : function(opt, xhr, data) {
		xhr.setRequestHeader("Authorization", data.auth);
	},
       

	loginSuccessCallback : function(data, opt, params) {
		console.debug('loginSuccessCallback');
		Ember.run(function() {
			resolve({
				// FIXME:
				token : response.session.token
			});
		});
	},
      

	loginErrorCallback : function(request, ajaxOptions, error, opt) {
		console.debug('loginFailCallback');
		var response = JSON.parse(xhr.responseText);
		Ember.run(function() {
			// FIXME:
			reject(response.error);
		});
	},
      
	invalidate : function() {
		var _this = this;
		return new Ember.RSVP.Promise(function(resolve) {
			Ember.$.ajax({
				url : _this.tokenEndpoint,
				type : 'DELETE'
			}).always(function() {
				resolve();
			})
		});
	},

});

var ColorsAuthorizer =  Ember.SimpleAuth.Authorizers.Base.extend({
	authorize: function(jqXHR, requestOptions) {
		console.debug('ColorsAuthorizer.authorize()');
		return function(jqXHR, requestOptions) {
			if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
				jqXHR.setRequestHeader('Authorization', 'Token: ' + this.get('session.token'));
			}
		}
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