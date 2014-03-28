(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
module.exports = Em.Application.create({
	name : 'Nable DataWorks',
	rootElement : '#wrapper',
  LOG_TRANSITIONS: true
});
});

;require.register("config", function(exports, require, module) {

var App = require('app');

App.testMode = (location.port == '3333'); // test mode is automatically enabled if running on brunch server
App.testModeDelayForActions = 10000;
//App.apiPrefix = '/api';
App.timeout = 180000; // default AJAX timeout
App.maxRetries = 3; // max number of retries for certain AJAX calls
App.bgOperationsUpdateInterval = 6000;
App.componentsUpdateInterval = 6000;
App.contentUpdateInterval = 15000;
App.maxRunsForAppBrowser = 500;
App.pageReloadTime=3600000;

$.ajaxSetup({
  cache: false
});
});

;require.register("controllers", function(exports, require, module) {
require('controllers/application');
require('controllers/hello');
});

;require.register("controllers/application", function(exports, require, module) {
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var App = require('app');

App.ApplicationController = Em.Controller.extend({

  name: 'applicationController',

  init: function(){
    this._super();
  }
});
});

;require.register("controllers/hello", function(exports, require, module) {
var App = require('app');

App.HelloController = Em.ObjectController.extend({
	name : 'helloController',

	message : '',

	actions : {
		getMessage : function() {
			if (this.get('message') != '') {
				this.set('message', '');
			}
			App.ajax.send({
				name : 'hello',
				sender : this,
				data : {
					x : 'hello'
				},
				success : 'getMessageSuccessCallback',
				error : 'getMessageErrorCallback'
			});
		},
	},

	getMessageSuccessCallback : function(data) {
		this.set('message', data);
	},

	getMessageErrorCallback : function(error) {
		console.log("failed to invoke get message from the server");
	}
});

});

;require.register("data/statusCodes", function(exports, require, module) {
module.exports = {
	200: function () {
		console.log("Status code 200: Success.");
  },
  202: function () {
    console.log("Status code 202: Success for creation.");
  },
	400: function () {
		console.log("Error code 400: Bad Request.");
	},
	401: function () {
		console.log("Error code 401: Unauthorized.");
	},
	402: function () {
		console.log("Error code 402: Payment Required.");
	},
	403: function () {
		console.log("Error code 403: Forbidden.");
    App.router.logOff();
	},
	404: function () {
		console.log("Error code 404: URI not found.");
	},
	500: function () {
		console.log("Error code 500: Internal Error on server side.");
	},
	501: function () {
		console.log("Error code 501: Not implemented yet.");
	},
	502: function () {
		console.log("Error code 502: Services temporarily overloaded.");
	},
	503: function () {
		console.log("Error code 503: Gateway timeout.");
	}
};

});

;require.register("ember", function(exports, require, module) {
module.exports=Ember;
});

;require.register("initialize", function(exports, require, module) {
window.App = require('app');

require('config');
require('messages');
require('controllers');
require('templates');
require('views');
require('router');
require('utils/ajax');

console.log('after initialize');
});

;require.register("messages", function(exports, require, module) {
Em.I18n.translations = {
	'app.name' : 'Nable DataWorks',
};
});

;require.register("models", function(exports, require, module) {

});

;require.register("router", function(exports, require, module) {
var App = require('app');
App.Router.map(function() {
	this.route("hello", {
		path : "/hello"
	});
});

App.HelloRoute = Ember.Route.extend({
	index : Ember.Route.extend({
		route : '/',
		enter : function(router, context) {
			alert(1122);
		},
		redirectsTo : 'hello'
	}),

	hello : Ember.Route.extend({
		route : '/hello',

		enter : function(router, context) {
			alert(11);
		},

		connectOutlets : function(router, context) {
			$('title').text(Em.I18n.t('app.name'));
			router.get('applicationController').connectOutlet('hello');
		},

		getMessage : function(router, event) {
			App.router.get('helloController').getMessage();
		},
	})

});

App.IndexRoute = Ember.Route.extend({
	beforeModel : function() {
		this.transitionTo('hello');
	}
});

});

;require.register("templates", function(exports, require, module) {

});

;require.register("templates/application", function(exports, require, module) {
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n\n<div id=\"main\">\n  <div id=\"top-nav\">\n    <div>\n      <div>\n        <div>\n          <a target=\"_blank\" alt=\"Nable DataWorks\" title=\"Nable DataWorks\">");
  data.buffer.push(escapeExpression((helper = helpers.t || (depth0 && depth0.t),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "app.name", options) : helperMissing.call(depth0, "t", "app.name", options))));
  data.buffer.push("</a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div>\n    <div id=\"content\">\n      ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n  </div>\n</div>\n\n\n");
  return buffer;
  
});
module.exports = module.id;
});

;require.register("templates/hello", function(exports, require, module) {
Ember.TEMPLATES[module.id] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"row\">\n	<div class=\"span6\">\n		<div class=\"box\">\n			<button class=\"btn btn-inverse\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "getMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n				hello\n			</button>\n			");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
    'class': ("span6"),
    'valueBinding': ("message"),
    'rows': ("5"),
    'placeholder': ("")
  },hashTypes:{'class': "STRING",'valueBinding': "STRING",'rows': "STRING",'placeholder': "STRING"},hashContexts:{'class': depth0,'valueBinding': depth0,'rows': depth0,'placeholder': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n		</div>\n	</div>\n</div>\n");
  return buffer;
  
});
module.exports = module.id;
});

;require.register("utils/ajax", function(exports, require, module) {
var App = require('app');

/**
 * Config for each ajax-request
 *
 * Fields example:
 *  mock - testMode url
 *  real - real url (without API prefix)
 *  type - request type (also may be defined in the format method)
 *  format - function for processing ajax params after default formatRequest. Return ajax-params object
 *  testInProduction - can this request be executed on production tests (used only in tests)
 *
 * @type {Object}
 */
var urls = {
  'hello': {
    'real': 'hello?x={x}',
    'type': 'GET'
  }
};
/**
 * Replace data-placeholders to its values
 *
 * @param {String} url
 * @param {Object} data
 * @return {String}
 */
var formatUrl = function (url, data) {
  var keys = url.match(/\{\w+\}/g);
  keys = (keys === null) ? [] : keys;
  if (keys) {
    keys.forEach(function (key) {
      var raw_key = key.substr(1, key.length - 2);
      var replace;
      if (!data[raw_key]) {
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
    //dataType: 'json',
    statusCode: require('data/statusCodes')
  };
  
  opt.url = '/api/' + formatUrl(this.real, data);

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
App.ajax = {
  /**
   * Send ajax request
   *
   * @param {Object} config
   * @return Object jquery ajax object
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
    var params = { };

    // extend default parameters with provided
    if (config.data) {
      jQuery.extend(params, config.data);
    }

    var opt = {};
    opt = formatRequest.call(urls[config.name], params);

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
        config.sender[config.error](request, ajaxOptions, error, opt);
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
  }
}

});

;require.register("views", function(exports, require, module) {
require('views/application');
require('views/hello');
});

;require.register("views/application", function(exports, require, module) {
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var App = require('app');

App.ApplicationView = Em.View.extend({
    templateName: require('templates/application')
});
});

;require.register("views/hello", function(exports, require, module) {

var App = require('app');

App.HelloView = Em.View.extend({
  templateName:require('templates/hello'),
  didInsertElement:function () {
    
  }
  
});

});

;
//# sourceMappingURL=app.js.map