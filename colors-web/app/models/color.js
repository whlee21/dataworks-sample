//export default = App.Store = DS.Store.extend({
//	adapter: DS.RESTAdapter
//});

//export default = App.ApplicationSerializer = DS.RESTSerializer.extend({});
//	

export default = App.Color = DS.Model.extend({
    color: DS.attr('string'),
});