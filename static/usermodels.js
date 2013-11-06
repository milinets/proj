appTemplates.login_template = hereDoc(function(){/*
    <li>
        <a id="login_button" href="#"><span><img src="/static/img/email_sign_in_blue.png"/></span></a>
    </li>
*/});

appTemplates.logout_template = hereDoc(function(){/*
    <li>
        <a id="logout_button" class="btn btn-default" href="#">Log out, <%= email %> </a>
    </li>
*/});

LoginView = Backbone.View.extend({
    initialize: function(){
        var that=this;
        navigator.id.watch({
              loggedInUser: this.model.get('loggedIn'),
              onlogin: function(assertion) {
                // A user has logged in! Here you need to:
                // 1. Send the assertion to your backend for verification and to create a session.
                // 2. Update your UI.
                $.ajax({ /* <-- This example uses jQuery, but you can use whatever you'd like */
                  type: 'POST',
                  url: '/auth/login', // This is a URL on your website.
                  data: {assertion: assertion},
                  success: function(res, status, xhr) { 
                      that.model.set(res);
                  },
                  error: function(xhr, status, err) {
                    navigator.id.logout();
                    that.model.clear({silent:true});
                    that.model.set({'loggedIn':false});
                    app.navigate('#home',{trigger:true});
                    humane.log('Login failure: '+ err);
                  }
                });
              },
              onlogout: function() {
                // A user has logged out! Here you need to:
                // Tear down the user's session by redirecting the user or making a call to your backend.
                // Also, make sure loggedInUser will get set to null on the next page load.
                // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
                $.ajax({
                  type: 'POST',
                  url: '/auth/logout', // This is a URL on your website.
                  success: function(res, status, xhr) { 
                      that.model.clear({silent:true});
                      that.model.set({'loggedIn':false});
                      app.navigate('#home', {trigger: true});
                  },
                  error: function(xhr, status, err) { 
                      console.log("Logout failure: " + err); 
                  }
                });
              }
        });
        this.model.on("change",this.render,this);
        this.render();
    },
    login_template: _.template(window.appTemplates.login_template),
    logout_template: _.template(window.appTemplates.logout_template),
    render: function(){
        if (this.model.get('loggedIn')) {
            this.$el.html( this.logout_template(this.model.attributes) );
        } else {
            this.$el.html( this.login_template(this.model.attributes) );
        }
        return this;
    },
    events: {
        "click #login_button": function(e){ navigator.id.request(); return false },
        "click #logout_button": function(e){ navigator.id.logout(); return false }
    }
});

UserModel = Backbone.Model.extend({
    defaults: {
      'loggedIn':false
    }
});