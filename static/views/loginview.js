
// Filename: views/loginview

define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!/static/templates/login.html',
  'text!/static/templates/loggedin.html',
], function($, _, Backbone, loginTemplate, loggedInTemplate){
  var LoginView = Backbone.View.extend({
    el: $('#login_container'),
    render: function(){
      // Using Underscore we can compile our template with data
      if (this.model.get('loggedIn')) {
          this.template = loggedInTemplate
      } else {
          this.template = logInTemplate
      }
      var template = _.template( this.template, this.model.attributes );
      this.$el.html( template );
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function( event ){
        event.preventDefault();
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login(this);
    },
    doLogout: function(event) {
        event.preventDefault();
        this.model.logout(this);
    }
  });
  // Our module now returns our view
  return LoginView;
});
