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
        if (this.model.get('loggedIn')) {
            texttemplate = '<form class="navbar-form navbar-right"><button type="submit" id="logout_button" class="btn btn-success"> \
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
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        this.model.logout();
        window.user = new UserModel({});
        window.login_view = new LoginView({ el: $('#login_container'),model:window.user});
    }
});


UserModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        loggedIn: false        
    },
    urlRoot : '/j/login',
    initialize : function(){
        this.fetch();
    },
    login : function() {
        console.log('trying to log in' + JSON.stringify(this.attributes));
        this.save(this.attributes);
    },
    logout : function() {
        console.log("about to logout "+JSON.stringify(this.attributes));
        this.destroy();
    }
});

window.user = window.user || new UserModel({});
window.login_view = window.login_view || new LoginView({ el: $('#login_container'),model:window.user});
window.search_view = window.search_view || new SearchView({ el: $('#main_container') });

var AppRouter = Backbone.Router.extend({
        routes: {
            "login": "checklogin"
        }
    });

// Initiate the router
var app_router = new AppRouter;


app_router.on("checklogin", function() {
  alert('hello');
    window.user.is_logged_in(window.user);
});