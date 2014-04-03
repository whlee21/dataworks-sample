var App = require('app');

App.testMode = (location.port == '3333'); // test mode is automatically enabled if running on brunch server
App.apiPrefix = '/api/v1';

// this is to make sure that IE does not cache data when making AJAX calls to the server
if (!$.mocho) {
  $.ajaxSetup({
    cache: false,
    headers: {"X-Requested-By": "X-Requested-By"}
  });
}