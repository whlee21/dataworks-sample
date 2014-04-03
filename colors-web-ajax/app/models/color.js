var App = require('app');

App.Color = Ember.Model.extend({
	id : Ember.attr(),
	color : Ember.attr(),

});

App.Color.url = '/colors';

App.Color.adapter = App.Adapter.create({
	klass: null,
	records: null,
	params: null,
	isAjaxSuccess: true,
	
	findAll : function(klass, records) {
		console.debug('App.Color.findAll')
		return this.findQuery(klass, records, {});
	},

	findQuery : function(klass, records, params) {
		console.debug('App.Color.findQuery');
		this.records = records;
		this.klass = klass;

		App.ajax.send({
			name : 'colors.list',
			sender : this,
			data: null,
			success : 'findQuerySuccessCallback',
			error : 'findQueryErrorCallback'
		});
		
		return this.records;
	},
	
	findQuerySuccessCallback: function(json) {
		console.debug('findQuerySuccessCallback');
		var colors = new Array();
		console.debug(JSON.stringify(json));
		json.colors.forEach(function (color) {
			console.debug('color: ' + color.color);
			
		});
		var sortedColors = json.colors.sort(function(a, b) {
			return Ember.compare(a.name, b.name);
		});
		this.records.load(this.klass, sortedColors);
	},
	
	findQueryErrorCallback: function() {
		console.debug('findQueryErrorCallback');
	},

	createRecord : function(record) {
		console.debug('App.Color.createRecord');
		// var colorName = record.get('color');
		var url = '/colors';
		// var jsonData = {
		// color: record.get('color')
		// };
		var newJson = record.toJSON();

		console.debug('newJson: ' + newJson);

		App.ajax.send({
			name : 'colors.create',
			sender : this,
			data: { color: record.get('color') },
			success : 'createRecordSuccessCallback',
			error : 'createRecordErrorCallback'
		});
	},
	
	createRecordSuccessCallback: function(data) {
	},
	
	createRecordErrorCallback: function() {
	},
	
	deleteRecord : function(record) {
		console.debug('App.Color.deleteRecord');

		App.ajax.send({
			name : 'colors.delete',
			sender : this,
			data: { color: record.get('color') },
			success : 'deleteRecordSuccessCallback',
			error : 'deleteRecordErrorCallback'
		});

		return record.reload();
	},
	
	deleteRecordSuccessCallback: function(data) {
		console.debug('deleteRecordSuccessCallback');
	},
	
	deleteRecordErrorCallback: function() {
		console.debug('deleteRecordErrorCallback');
	},
});