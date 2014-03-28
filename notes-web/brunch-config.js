var sysPath = require('path');
startsWith = function(string, substring) {
    return string.lastIndexOf(substring, 0) === 0;
};

exports.config = {
  paths: {
    public: 'public',
    watched: [ 'app', 'test', 'vendor' ]
  },
  files: {
    javascripts: {
      joinTo: {
        'javascripts/app.js': /^app/,
        'javascripts/vendor.js': /^(vendor|bower_components)/
      },
      order: {
        before: []
      }
    },
    stylesheets: {
      joinTo: {
        'stylesheets/app.css': /^(app|vendor|bower_components)/
      },
      order: {
        before: []
      }
    },
    templates: {
      precompile: true,
      root: 'templates',
      joinTo: {
        'javascripts/app.js': /^app/
      }
    }
  },
  conventions: {
    ignored: function(path) {
        return startsWith(sysPath.basename(path), '_') && sysPath.dirname(path).indexOf('templates') < 0;
    }  
  }
};