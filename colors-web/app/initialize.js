window.App = require('config/app');

require('config/store');
require('config/adapter');
require('config/router');

// Load all modules in order automagically. Ember likes things to work this
// way so everything is in the App.* namespace.
var folderOrder = [
    'initializers', 'mixins', 'models', 'routes',
    'views', 'controllers', 'helpers',
    'templates', 'components'
];

folderOrder.forEach(function(folder) {
  window.require.list().filter(function(module) {
    return new RegExp("^" + folder + "/").test(module);
  }).forEach(function(module) {
    require(module);
  });
});
