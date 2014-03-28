export default = App.NotesRoute = Ember.Route.extend({
	model : function() {
		return this.store.find('note');
	}
});
