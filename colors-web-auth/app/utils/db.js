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

App.db = {};
var InitialData =  {
  'app': {
    'configs': []
  },
};

if (typeof Storage !== 'undefined') {
  Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
  };

  Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
  };
} else {
  // stub for unit testing purposes
  window.localStorage = {};
  localStorage.setItem = function (key, val) {
    this[key] = val;
  };
  localStorage.getItem = function (key) {
    return this[key];
  };
  window.localStorage.setObject = function (key, value) {
    this[key] = value;
  };
  window.localStorage.getObject = function (key, value) {
    return this[key];
  };
}

App.db.cleanUp = function () {
  console.log('TRACE: Entering db:cleanup function');
  App.db.data = InitialData;
  console.log("In cleanup./..");
  localStorage.setObject('colors', App.db.data);
};

App.db.updateStorage = function() {
  App.db.data = localStorage.getObject('colors');
  if (App.db.data && App.db.data.app && App.db.data.app.configs) {
    return true;
  }
  console.warn("local storage is deprecated!");
  App.db.cleanUp();
  return false;
};

/*
  Initialize wizard namespaces if they are not initialized on login.
  This will be required during upgrade.
 */
App.db.mergeStorage = function() {
  if (localStorage.getObject('colors') == null) {
    console.log('doing a cleanup');
    App.db.cleanUp();
  } else {
    localStorage.setObject('colors', $.extend(true,{}, InitialData, App.db.data));
  }
};

// called whenever user logs in
if (localStorage.getObject('colors') == null) {
  console.log('doing a cleanup');
  App.db.cleanUp();
}

App.db.get = function (namespace, key) {
  console.log('TRACE: Entering db:get' + key);
  App.db.data = localStorage.getObject('colors');
  return App.db.data[namespace][key];
};

App.db.set = function (namespace, key, value) {
  console.log('TRACE: Entering db:set' + key + ';value: ', value);
  App.db.data = localStorage.getObject('colors');
  App.db.data[namespace][key] = value;
  localStorage.setObject('colors', App.db.data);
};
/*
 * setter methods
 */

/**
 * Set user model to db
 * @param user
 */
App.db.setUser = function (user) {
  console.log('TRACE: Entering db:setUser function');
  App.db.data = localStorage.getObject('colors');
  App.db.data.app.user = user;
  localStorage.setObject('colors', App.db.data);
};

App.db.setConfigs = function (configs) {
  App.db.data = localStorage.getObject('colors');
  App.db.data.app.configs = configs;
  localStorage.setObject('colors', App.db.data);
};

/**
 * Set localStorage with data from server
 */
App.db.setLocalStorage = function () {
  localStorage.setObject('colors', App.db.data);
};

/*
 *  getter methods
 */

/**
 * Get user model from db
 * @return {*}
 */
App.db.getUser = function () {
  console.log('TRACE: Entering db:getUser function');
  App.db.data = localStorage.getObject('colors');
  return App.db.data.app.user;
};

App.db.getConfigs = function () {
  App.db.data = localStorage.getObject('colors');
  return App.db.data.app.configs;
};

module.exports = App.db;
