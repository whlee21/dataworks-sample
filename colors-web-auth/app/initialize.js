window.App = require('app');

require('config');
require('messages');
require('utils/db');
require('utils/ajax');
require('adapter');
require('auth')
require('router')

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
