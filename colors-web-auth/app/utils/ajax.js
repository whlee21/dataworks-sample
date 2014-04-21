var App = require('app');

var urls = {
	'colors.list' : {
		'real' : '/colors',
		'mock' : '/data/colors.json'
	},

	'colors.create' : {
		'real' : '/colors',
		'mock' : '/data/colors_create.json',
		'format' : function(color) {
			return {
				type : 'POST',
				async : false,
				contentType : 'application/json',
				data : JSON.stringify({
					"color" : {
						color : color.color
					}
				})
			}
		}
	},

	'colors.delete' : {
		'real' : '/colors',
		'mock' : '/data/colors_delete.json',
		'format' : function(color) {
			return {
				type : 'DELETE',
				async : false,
				contentType : 'application/json',
				data : JSON.stringify({
					"color" : {
						id : color.id,
						color : color.color
					}
				})
			}
		}
	},

	'router.authentication' : {
		'real' : '/colors',
		'mock' : '/data/colors.json',
		'format' : function() {
			return {
				async : false
			};
		}
	},
		  
	'router.login' : {
		'real' : '/authenticate/jsonuserpass',
		'mock' : '/data/users/user_{usr}.json',
		'format' : function(data) {
			var statusCode = jQuery.extend({}, require('data/statusCodes'));
			statusCode['403'] = function() {
				console.log("Error code 403: Forbidden.");
			};
			return {
				statusCode : statusCode
			};
		}
	},
	
	'router.logoff' : {
		'real' : '/logout',
		'mock' : ''
	},
};

/**
 * Replace data-placeholders to its values
 * 
 * @param {String}
 *            url
 * @param {Object}
 *            data
 * @return {String}
 */
var formatUrl = function (url, data) {
  if (!url) return null;
  var keys = url.match(/\{\w+\}/g);
  keys = (keys === null) ? [] : keys;
  if (keys) {
    keys.forEach(function (key) {
      var raw_key = key.substr(1, key.length - 2);
      var replace;
      if (!data || !data[raw_key]) {
        replace = '';
      }
      else {
        replace = data[raw_key];
      }
      url = url.replace(new RegExp(key, 'g'), replace);
    });
  }
  return url;
};

/**
 * this = object from config
 * @return {Object}
 */
var formatRequest = function (data) {
  var opt = {
    type: this.type || 'GET',
    timeout: App.timeout,
    dataType: 'json',
    statusCode: require('data/statusCodes')
  };
  if (App.testMode) {
    opt.url = formatUrl(this.mock ? this.mock : '', data);
    opt.type = 'GET';
  }
  else {
    var prefix = this.apiPrefix != null ? this.apiPrefix : App.apiPrefix;
    opt.url = prefix + formatUrl(this.real, data);
  }

  if (this.format) {
    jQuery.extend(opt, this.format(data, opt));
  }
  return opt;
};

/**
 * Wrapper for all ajax requests
 *
 * @type {Object}
 */
var ajax = Em.Object.extend({
  /**
   * Send ajax request
   *
   * @param {Object} config
   * @return {$.ajax} jquery ajax object
   *
   * config fields:
   *  name - url-key in the urls-object *required*
   *  sender - object that send request (need for proper callback initialization) *required*
   *  data - object with data for url-format
   *  beforeSend - method-name for ajax beforeSend response callback
   *  success - method-name for ajax success response callback
   *  error - method-name for ajax error response callback
   *  callback - callback from <code>App.updater.run</code> library
   */
  send: function (config) {

    console.warn('============== ajax ==============', config.name, config.data);

    if (!config.sender) {
      console.warn('Ajax sender should be defined!');
      return null;
    }

    // default parameters
    var params = {};

    // extend default parameters with provided
    if (config.data) {
      jQuery.extend(params, config.data);
    }

    var opt = {};
// by whlee21
    if (!urls[config.name]) {
      console.warn('Invalid name provided!');
      return null;
    }
    opt = formatRequest.call(urls[config.name], params);

    opt.context = this;

    // object sender should be provided for processing beforeSend, success and error responses
    opt.beforeSend = function (xhr) {
      if (config.beforeSend) {
        config.sender[config.beforeSend](opt, xhr, params);
      }
    };
    opt.success = function (data) {
      console.log("TRACE: The url is: " + opt.url);
      if (config.success) {
        config.sender[config.success](data, opt, params);
      }
    };
    opt.error = function (request, ajaxOptions, error) {
      if (config.error) {
        config.sender[config.error](request, ajaxOptions, error, opt, params);
      } else {
        this.defaultErrorHandler(request, opt.url, opt.type);
      }
    };
    opt.complete = function () {
      if (config.callback) {
        config.callback();
      }
    };
    if ($.mocho) {
      opt.url = 'http://' + $.hostName + opt.url;
    }
    return $.ajax(opt);
  },

  // A single instance of App.ModalPopup view
  modalPopup: null,
  /**
   * defaultErrorHandler function is referred from App.ajax.send function and App.HttpClient.defaultErrorHandler function
   * @jqXHR {jqXHR Object}
   * @url {string}
   * @method {String} Http method
   * @showStatus {number} HTTP response code which should be shown. Default is 500.
   */
  defaultErrorHandler: function (jqXHR, url, method, showStatus) {
    method = method || 'GET';
    var self = this;
    var api = " received on " + method + " method for API: " + url;
    try {
      var json = $.parseJSON(jqXHR.responseText);
      var message = json.message;
    } catch (err) {
    }
    if (!showStatus) {
      showStatus = 500;
    }
    var statusCode = jqXHR.status + " status code";
    if (jqXHR.status === showStatus && !this.modalPopup) {
      this.modalPopup = App.ModalPopup.show({
        header: jqXHR.statusText,
        secondary: false,
        onPrimary: function () {
          this.hide();
          self.modalPopup = null;
        },
        bodyClass: Ember.View.extend({
          classNames: ['api-error'],
          templateName: require('templates/utils/ajax'),
          api: api,
          statusCode: statusCode,
          message: message,
          showMessage: !!message
        })
      });
    }
  }

});

/**
 * Add few access-methods for test purposes
 */
if ($.mocho) {
  ajax.reopen({
    /**
     * Don't use it anywhere except tests!
     * @returns {Array}
     */
    fakeGetUrlNames: function() {
      return Em.keys(urls);
    },

    /**
     * Don't use it anywhere except tests!
     * @param name
     * @returns {*}
     */
    fakeGetUrl: function(name) {
      return urls[name];
    },

    /**
     * Don't use it anywhere except tests!
     * @param url
     * @param data
     * @returns {String}
     */
    fakeFormatUrl: function(url, data) {
      return formatUrl(url, data);
    },

    /**
     * Don't use it anywhere except tests!
     * @param urlObj
     * @param data
     * @returns {Object}
     */
    fakeFormatRequest: function(urlObj, data) {
      return formatRequest.call(urlObj, data);
    }
  });
}

App.ajax = ajax.create({});
App.formatRequest = formatRequest;
App.urls = urls;