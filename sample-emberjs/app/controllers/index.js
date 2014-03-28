export default = App.IndexController = Ember.Controller.extend({
	
	message : '',
	
    actions: {
        addColor: function( ) {
            this.get( 'model' ).pushObject( this.get( 'colorToAdd' ) );
            this.set( 'colorToAdd', null );
        },
        removeColor: function( color ) {
            this.get( 'model' ).removeObject( color );
        },
        doDeleteNote: function (note) {
            this.set('noteForDeletion', note);
            $("#confirmDeleteNoteDialog").modal({"show": true});
        },
        doCancelDelete: function () {
            this.set('noteForDeletion', null);
            $("#confirmDeleteNoteDialog").modal('hide');
        },
		getMessage : function() {
			if (this.get('message') != '') {
				this.set('message', '');
			}
			App.ajax.send({
				name : 'hello',
				sender : this,
				data : {
					x : 'hello'
				},
				success : 'getMessageSuccessCallback',
				error : 'getMessageErrorCallback'
			});
		},
    },

    getMessageSuccessCallback : function(data) {
    	this.set('message', data);
    },

    getMessageErrorCallback : function(error) {
    	console.log("failed to invoke get message from the server");
    }
});
