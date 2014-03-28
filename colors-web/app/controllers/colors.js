export default = App.ColorsController = Ember.ArrayController.extend({
	colorToAdd: null,
    
    actions: {
        addColor: function( ) {
//            this.get( 'color' ).pushObject( this.get( 'colorToAdd' ) );
//            this.set( 'colorToAdd', null );
            
            var colorToAdd = this.get('colorToAdd');
            var newColor = this.store.createRecord('color');
            newColor.set('color', colorToAdd);
            newColor.save();

            this.set('colorToAdd', null);
        },
        removeColor: function( color ) {
            this.get( 'model' ).removeObject( color );
        }
    }

});