export default = App.NotesController = Ember.ArrayController.extend({
    needs: ['notesNote'],
    newNoteName: null,

    actions: {
        createNewNote: function() {
            var content = this.get('content');
            var newNoteName = this.get('newNoteName');
            var unique = newNoteName != null && newNoteName.length > 1;

            content.forEach(function(note) {
                if (newNoteName === note.get('name')) {
                    unique = false; return;
                }
            });

            if (unique) {
                var newNote = this.store.createRecord('note');
                newNote.set('id', newNoteName);
                newNote.set('name', newNoteName);
                newNote.save();

                this.set('newNoteName', null);
            } else {
                alert('Note must have a unique name of at least 2 characters!');
            }
        },

        doDeleteNote: function (note) {
            this.set('noteForDeletion', note);
            $("#confirmDeleteNoteDialog").modal({"show": true});
        },

        doCancelDelete: function () {
            this.set('noteForDeletion', null);
            $("#confirmDeleteNoteDialog").modal('hide');
        },

        doConfirmDelete: function () {
            var selectedNote = this.get('noteForDeletion');
            this.set('noteForDeletion', null);
            if (selectedNote) {
                this.store.deleteRecord(selectedNote);
                selectedNote.save();

                if (this.get('controllers.notesNote.model.id') === selectedNote.get('id')) {
                    this.transitionToRoute('notes');
                }
            }
            $("#confirmDeleteNoteDialog").modal('hide');
        }
    }
});
