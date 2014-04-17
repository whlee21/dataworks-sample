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
        'js/app.js': /^app/,
        'js/vendor.js': /^(vendor)/
      },
      order: {
        before: [
          'vendor/js/jquery.js',
          'vendor/js/handlebars.js',
          'vendor/js/ember.js',
          'vendor/js/ember-model.js',
          'vendor/js/ember-data.js',
          'vendor/js/ember-simple-auth.js',
          'vendor/js/ember-simple-auth-oauth2.js',
          'vendor/js/plurals.js',
          'vendor/js/util.js',
          'vendor/js/i18n.js',
          'vendor/js/bootstrap.js'
          ]
      }
    },
    stylesheets: {
      joinTo: {
        'css/app.css': /^(app|vendor)/
      },
      order: {
        before: []
      }
    },
    templates: {
      precompile: true,
      root: 'templates',
      joinTo: {
        'js/app.js': /^app/
      }
    }
  },
  conventions: {
    ignored: function(path) {
        return startsWith(sysPath.basename(path), '_') && sysPath.dirname(path).indexOf('templates') < 0;
    }  
  }
};
