export default = App.ColorsRoute = Ember.Route.extend({
	model : function() {
		return this.store.find('color');
	}
});