var App = require('app');

App.Router.reopen({
	loginName : function() {
		return this.getLoginName();
	}.property('loggedIn'),

	getLoginName : function() {
		return App.db.getLoginName();
	},

	setLoginName : function(loginName) {
		App.db.setLoginName(loginName);
	}
})

App.Router.map(function() {
	this.route('colors', {path : "/"});
	this.route('login');
});