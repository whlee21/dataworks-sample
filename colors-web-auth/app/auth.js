var App = require('app');

App.ColorsAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({

	resolve: null,
	reject: null,
	
	hash: null,

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
		this.hash = window.btoa(loginName + ":" + credentials.password);
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
					auth : "Basic " + _this.hash,
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
		Ember.run(function() {
			var users = data['Users'];
			users.roles.forEach(function(role) {
				console.debug('role: ' + role)
			});
			_this.resolve({
				// FIXME:
//				token : users.token
				user_id: users.user_name,
				user_roles: users.roles
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
			_this.resolve = resolve;
			if (!App.testMode) {
				App.ajax.send({
					name : 'router.logoff',
					sender : _this,
					data : {
						auth : "Basic " + _this.hash
					},
					beforeSend : 'authBeforeSend',
					success : 'logOffSuccessCallback',
					error : 'logOffErrorCallback'
				});
			}
		});
	},

	logOffSuccessCallback : function(data) {
		console.log("invoked logout on the server successfully");
		App.db.cleanUp();
		resolve();
	},

	logOffErrorCallback : function(req) {
		console.log("failed to invoke logout on the server");
	}
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