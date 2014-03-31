module.exports = App.Color = App.Model.extend();

module.exports = App.Color.reopenClass({
	collection: Ember.A(),
	
	log: function() {
		console.log("log");
	},
	
	find: function(id) {
		console.log('App.Color.find: ' + id);
		return App.Model.find(id, App.Color);
	},
	
	findAll: function() {
		console.log('App.Color.findAll');
		return App.Model.findAll('/colors', App.Color, 'colors');
	},
	
	createRecord: function(model) {
		App.Model.createRecord('/colors', App.Color, model);
	},
	
	deleteRecord: function(id) {
		App.Model.deleteRecord('/colors', App.Color, id);
	}
});