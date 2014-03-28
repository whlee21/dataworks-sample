export default = App.ColorsController = Ember.ArrayController.extend({
	colorToAdd: null,
    
    actions: {
        addColor: function( ) {         
            var colorToAdd = this.get('colorToAdd');
            var newColor = this.store.createRecord('color');
            newColor.set('color', colorToAdd);
            newColor.save();

            this.set('colorToAdd', null);
        },
        
        removeColor: function( color ) {
            console.log(color.get('color'));
            this.store.deleteRecord(color);
            color.get('isDeleted');
            color.save();
        }
    }

});