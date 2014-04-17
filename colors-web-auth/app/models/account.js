var App = require('app');

App.Account = DS.Model.extend({
	login: DS.attr(),
	name: DS.attr(),
});