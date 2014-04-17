var App = require('app');

App.ColorsAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({

	tokenEndpoint: App.apiPrefix + '/user',

	resolve: null,
	reject: null,

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
			if (loginName === "admin" && credentials.password === 'admin') {
				usr = 'admin';
			} else if (loginName === 'user'	&& credentials.password === 'user') {
				usr = 'user';
			}
		}

		return new Ember.RSVP.Promise(function(resolve, reject) {
			_this.resolve = resolve;
			_this.reject = reject;
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
		var _this = this;
		//		console.debug('loginSuccessCallback');
		console.debug('data: ' + util.inspect(data));
		console.debug('opt: ' + util.inspect(opt));
		console.debug('params: ' + util.inspect(params));
		console.debug(util.inspect(App.Router));
		App.router.setLoginName(params.loginName);
		console.log('getLoginName: ' + App.router.getLoginName());
		Ember.run(function() {
//			var users = data['Users'];
//			var username = users.user_name;
//			users.roles.forEach(function(role) {
//				console.debug('role: ' + role)
//			});
			_this.resolve({
				// FIXME:
//				token : response.session.token
				token: data
			});
		});
	},    

	loginErrorCallback : function(request, ajaxOptions, error, opt) {
		console.debug('loginFailCallback');
		var _this = this;
//		console.debug('request: ' + util.inspect(request));
//		console.debug('request.statusCode: ' + request.statusCode);
//		console.debug('ajaxOptions: ' + util.inspect(ajaxOptions));
//		console.debug('error: ' + util.inspect(error));
//		console.debug('opt: ' + util.inspect(opt));
		Ember.run(function() {
			// FIXME:
			_this.reject(request.responseText);
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

App.ColorsAuthorizer =  Ember.SimpleAuth.Authorizers.Base.extend({
	authorize: function(jqXHR, requestOptions) {
		console.debug('ColorsAuthorizer.authorize()');
		console.debug('session: ' + util.inspect(this.get('session')))
		if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
			jqXHR.setRequestHeader('Authorization', 'Token: ' + this.get('session.token'));
		}
	}
});

App.SimpleAuthOptions = {
	authorizerFactory: 'authorizer:colors',
	routeAfterAuthentication: 'colors'
};

module.exports = [App.ColorsAuthenticator, App.ColorsAuthorizer, App.SimpleAuthOptions];