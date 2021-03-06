module.exports = App.ColorsController = Ember.ArrayController.extend({
	colorToAdd: null,
    
    actions: {
        addColor: function( ) {
        	var content = this.get('content');
            var colorToAdd = this.get('colorToAdd');
            var unique = colorToAdd != null && colorToAdd.length > 1;
            
            content.forEach(function(color) {
            	if (colorToAdd == color.get('color')) {
            		unique = false; return;
            	}
            });
            
            if (unique) {
            	var newColor = this.store.createRecord('color');
            	newColor.set('color', colorToAdd);
            	newColor.save();

            	this.set('colorToAdd', null);
        	} else {
        		alert('Color must have a unique name of at least 2 characters!')
        	}
        },
        
        removeColor: function( color ) {
// this.store.deleteRecord(color);
// color.save();
        	color.destroyRecord().then(function(){
       			router.transitionTo('colors')
        	});
        },
   }
});
