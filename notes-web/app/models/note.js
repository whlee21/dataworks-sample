export default = App.Store = DS.Store.extend({
	adapter: DS.LSAdapter
});

export default = App.Note = DS.Model.extend({
	name: DS.attr('string'),
	value: DS.attr('string')
});
