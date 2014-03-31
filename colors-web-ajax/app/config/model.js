module.exports = App.Model = Ember.Object.extend();

module.exports = App.Model.reopenClass({
	find: function(id, type) {
		var foundItem = this.contentArrayContains(id, type);
		
		if (!foundItem) {
			foundItem = type.create({id: id, isLoaded: false});
			Ember.get(type, 'collection').pushObject(foundItem);
		}
		
		return foundItem;
	},
	
	findAll: function(url, type, key) {
		var collection = this;
		
		console.log('collection: ' + collection);
		$.getJSON(url, function(data) {
			console.log('getJSON: ' + url);
			$.each(data[key], function(i, row) {
				console.log('id: ' + row.id + ", color: " + row.color);
				console.log('collection: ' + collection);
				var item = type.get('id');
				console.log('item: ' + item);
				if (!item) {
					item = type.create();
					Ember.get(type, 'collection').pushObject(item);
				}
				item.setProperties(row);
				item.set('isLoaded', true);
			});
		});
		
		return Ember.get(type, 'collection');
	},
	
	createRecord: function(url, type, model) {
		var collection = this;
		
		model.set('isSaving', true);
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(model),
			success: function(res, status, xhr) {
				if (res.submitted) {
					Ember.get(type, 'collection').pushObject(model);
					model.set('isSaving', false);
				} else {
					model.set('isError', true);
				}
			},
			error: function(xhr, status, err) {
				model.set('isError', true);
			}
		});
	},
	
	deleteRecord: function(url, type, id) {
		var collection = this;
		$.ajax({
			type: 'DELETE',
			url: url + "/" + id,
			success: function(res, status, xhr) {
				if (res.deleted) {
					var item = collection.contentArrayContains(id, type);
					if (item) {
						Ember.get(type, 'collection').removeObject(item);
					}
				}
			},
			error: function(xhr, status, err) {
				alert('Unable to delete: ' + status + " :: " + err);
			}
		});
	}
});