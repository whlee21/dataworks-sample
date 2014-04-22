var App = require('app');

App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
    authenticatorFactory: 'authenticator:colors',
    
    errorMessage: null,

//    authenticate: function() {
//    	
//    }
});