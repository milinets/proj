SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<label>Search</label> \
            <input type="search" id="search_input"/> \
            <input type="button" id="search_button" value="Search" />';
        var template = _.template( texttemplate, {});
        this.$el.html( template );
    },
    events: {
        "click input[type=button]": "doSearch"
    },
    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        console.log( "Search for " + $("#search_input").val() );
    }
});


LoginView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<form class="navbar-form navbar-right"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" id="username_input" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" id="password_input" class="form-control"> \
                            </div> \
                            <button type="submit" id="login_button" class="btn btn-success">Sign in</button> \
                          </form>';
        if (this.model.get('loggedIn')) {
            texttemplate = '<form class="navbar-form navbar-right"><button type="submit" id="logout_button" class="btn btn-success"> \
                                    Logout, <%= username %></button></form>';
        }
        var template = _.template( texttemplate, this.model.attributes );
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


UserModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        loggedIn: false        
    },
    login : function(ctx) {
        console.log("about to log in: "+JSON.stringify(ctx.model.attributes));
        $.ajax({
            type : "POST",
            url : '/login',
            data : {username: this.get('username'), password: this.get('password')},
            success : function(data) {
                ctx.model.set('password','');
                ctx.model.set('loggedIn',true);
                console.log("successful login: "+JSON.stringify(ctx.model.attributes));
            },
            error : function(xhr, ajaxOptions, thrownError) {
                ctx.model.set('password','');
                console.log("login failed: "+JSON.stringify(xhr.status));
                console.log("thrown error: "+thrownError);
                console.log("user set to: "+JSON.stringify(ctx.model.attributes));
            }
        });
    },
    logout : function(ctx) {
        console.log("about to logout "+JSON.stringify(ctx.model.attributes));
        $.ajax({
            type : "POST",
            url : '/logout',
            success : function(data) {
                console.log("Response from server: "+JSON.stringify(data));
                ctx.model.set({
                    username: '',
                    password: '',
                    loggedIn: false
                });
                console.log("logged out "+JSON.stringify(ctx.model.attributes));
            }
        });
    },
    is_logged_in : function(ctx) {
        $.ajax({
            type : "GET",
            url : '/login',
            success : function(data) {
                ctx.set('loggedIn',true);
            },
            error : function(data) {
                ctx.set('loggedIn',false);
            }
        });
    }
});

window.user = new UserModel({});
window.login_view = new LoginView({ el: $('#login_container'),model:window.user});
window.search_view = new SearchView({ el: $('#main_container') });

var AppRouter = Backbone.Router.extend({
        routes: {
            "login": "checklogin"
        }
    });

// Initiate the router
var app_router = new AppRouter;
app_router.on("checklogin", function() {
    window.user.is_logged_in(window.user);
});