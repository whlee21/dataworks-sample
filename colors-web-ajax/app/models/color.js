require('utils/get_json');
require('utils/ajax');

module.exports = App.Color = Ember.Model.extend({
	id : Ember.attr(),
	color : Ember.attr(),

});

App.Color.url = '/colors';

App.Color.adapter = App.Adapter.create({
	findAll : function(klass, records) {
		console.log('App.Color.findAll')
		return this.findQuery(klass, records, {});
	},
	findQuery : function(klass, records, params) {
		console.log('test')
		return App.getJSON('/colors', {
			type : "enterable",
			include_fields : params.include_fields || "id, color"
		}).then(function(json) {
			var sortedColors = json.colors.sort(function(a, b) {
				return Ember.compare(a.name, b.name);
			});
			records.load(klass, sortedColors);
			return records;
		});
	},
	createRecord: function(record) {
		console.log('App.Color.createRecord');
		var colorName = record.get('color');
		var url = '/colors';
		var data = {
				color: colorName
		};
		
		return App.ajax(url, {
			type: 'POST',
			dataType: 'json',
			//contentType: 'application/json',
			data: data,
		}).then(function(data) {
			record.load(data.id, record.get('_data'));
			console.debug('then');
			return record.reload();
		});
	}
});