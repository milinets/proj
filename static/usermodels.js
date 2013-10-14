LoginView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        if (this.model.get('loggedIn')) {
            var texttemplate = '<form class="navbar-form navbar-right"><button type="submit" id="logout_button" class="btn btn-success"> \
                                    Logout, <%= username %></button></form>';
        } else {
        var texttemplate='<form class="navbar-form navbar-right"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" id="username_input" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" id="password_input" class="form-control"> \
                            </div> \
                            <button type="submit" id="login_button" class="btn btn-success">Sign in</button> \
                          </form>';
        }
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function(event){
        event.preventDefault();
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        event.preventDefault();
        this.model.logout();
    }
});

UserModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        loggedIn: false        
    },
    initialize: function() {
        var that = this;
        $.get('/j/login', function(data){
            that.set(data);
        });
    },
    login : function() {
        var that = this;
        $.post('/j/login', that.attributes, function(data){
            if (data) {
                that.set(data);
            }
        });
    },
    logout : function() {
        var that = this;
        $.post('/j/logout', function(data){
            that.set(data);
        });
    }
});