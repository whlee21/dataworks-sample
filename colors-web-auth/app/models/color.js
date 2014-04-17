var App = require('app');

App.Color = Ember.Model.extend({
	id : Ember.attr(),
	color : Ember.attr(),
});

App.Color.url = App.apiPrefix + "/colors";

App.Color.adapter = App.Adapter.create({
	klass: null,
	records: null,
	params: null,
	record: null,
	
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
//		if (json.colors == null) {
////			App.showAlertPopup('title', 'body');
//			alert('No colors...');
//			this.records = Ember.RecordArray.create({});
//		    return;
//		}
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
		
		this.record = record;

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
		console.debug('createRecordSuccessCallback id = ' + data.id);
		this.record.set('id', data.id);
		this.record.didCreateRecord();
	},
	
	createRecordErrorCallback: function() {
		console.debug('createRecordErrorCallback');
	},
	
	deleteRecord : function(record) {
		console.debug('App.Color.deleteRecord');
		
		this.record = record;
		
		App.ajax.send({
			name : 'colors.delete',
			sender : this,
			data : {
				id: record.get('id'),
				color : record.get('color')
			},
			success : 'deleteRecordSuccessCallback',
			error : 'deleteRecordErrorCallback'
		});
	},
	
	deleteRecordSuccessCallback: function(data) {
		console.debug('deleteRecordSuccessCallback');
		this.record.didDeleteRecord();
	},
	
	deleteRecordErrorCallback: function() {
		console.debug('deleteRecordErrorCallback');
	},
});