//export default = App.ApplicationAdapter = DS.RESTAdapter.extend({
//	namespace: 'api/v1'
//});
//
export default = App.Store = DS.Store.extend({
	adapter:  DS.LSAdapter
});