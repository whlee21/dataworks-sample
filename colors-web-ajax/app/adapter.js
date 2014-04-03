//module.exports = App.RESTAdapter = RL.RESTAdapter.create({
//	host: 'http://localhost:3333'
//});
//
//module.exports = App.Client = RL.Client.create({
//	adapter: App.RESTAdapter
//});

var App = require('app');

App.Adapter = Ember.RESTAdapter.extend({
	ajaxSettings: function(url, method) {
		return {
			url: url,
			type: method,
			dataType: 'json'
		}
	}
});