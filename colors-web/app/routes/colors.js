export default = App.ColorsRoute = Ember.Route.extend({
	model : function() {
		return this.store.find('color');
	}

//	model: function() {
//		return [{color: 'red'}, {color:'yellow'}, {color:'blue'}];
//	}
});