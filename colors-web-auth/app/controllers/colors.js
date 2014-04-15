var App = require('app');

App.ColorsController = Ember.ArrayController.extend({
	colorToAdd: null,
    
    actions: {
        addColor: function( ) {
        	var content = this.get('content');
            var colorToAdd = this.get('colorToAdd');
            var unique = colorToAdd != null && colorToAdd.length > 1;
            
            console.debug('colorToAdd: ' + colorToAdd);
            content.forEach(function(color) {
            	console.debug('color: ' + color.get('color'))
            	if (colorToAdd == color.get('color')) {
            		unique = false; return;
            	}
            });
            
            if (unique) {
            	var newColor = App.Color.create();
            	newColor.set('color', colorToAdd);
            	newColor.save();

            	this.set('colorToAdd', null);
        	} else {
        		alert('Color must have a unique name of at least 2 characters!')
        	}
        },
        
        removeColor: function( color ) {
        	color.deleteRecord(color.get('id'));
//        	color.deleteRecord(color.get('id')).then(function(){
////       			App.ColorsRoute.transitionTo('/');
//        		App.router.transitionTo('colors');
//        	});
        },
   }
});