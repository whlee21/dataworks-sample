module.exports = App.ColorsRoute = Ember.Route.extend({
	model : function() {
		console.log('App.ColorsRoute.model.findAll')
		return App.Color.findAll();
	}
});