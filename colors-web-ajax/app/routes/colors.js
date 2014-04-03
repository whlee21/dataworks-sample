var App = require('app');

App.ColorsRoute = Ember.Route.extend({
	model : function() {
		console.debug('App.ColorsRoute.model.findAll')
//		App.ajax.send({
//			name : 'colors',
//			sender : this,
//			data: null,
//			success : 'modelSuccessCallback',
//			error : 'modelErrorCallback'
//		});
		return App.Color.findAll();
//		return ['red', 'yellow', 'blue'];
	},

//	modelSuccessCallback: function(data) {
//		console.log('modelSuccessCallback');
//	},
//	
//	modelErrorCallback: function() {
//		console.log('modelErrorCallback');
//	}
});