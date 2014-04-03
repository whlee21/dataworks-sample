module.exports = App.ColorsRoute = Ember.Route.extend({
	model : function() {
		console.debug('App.ColorsRoute.model.findAll')
		return App.Color.findAll();
	}
});