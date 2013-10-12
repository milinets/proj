SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<form id="searchForm"><label>Search</label> \
            <input type="search" id="search_input"/> \
            <input type="submit" id="search_button" value="Search" /></form>';
        var template = _.template( texttemplate, {});
        this.$el.html( template );
    },
    events: {
        "click input[type=submit]": "doSearch"
    },
    doSearch: function( event ){
        console.log( "Search for " + $('#search_input').val() );
        $.post('/j/search', $('#searchForm').serialize(), function(data) {
            console.log(data);
        });
    }
});


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
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        this.model.logout();
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
        this.save();
    },
    logout : function() {
        this.save();
        this.unset('id');
    }
});


window.user = new UserModel({});
window.login_view = new LoginView({ el: $('#login_container'),model:window.user});
window.search_view = new SearchView({ el: $('#searchbox') });

var AppRouter = Backbone.Router.extend({
        routes: {
            "home": "home",
            "about": "about",
            "entercase": "entercase",
            "showcase": "showcase",
            "editcase/:id": "editcase",
            "registeruser": "registeruser",
            "updateuser/:id": "updateuser"
        },
        showView: function(selector, view) {
          if (this.currentView)
              this.currentView.close();
          $(selector).html(view.render().el);
          this.currentView = view;
          return view;
        }
    });

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};



// Initiate the router


var app = new AppRouter;

app.on("route:home", function() {
    $("#main_container").html("<h2>This is the homepage</h2>");
});
    
app.on("route:about", function() {
    $("#main_container").html("<h2>About this site</h2>");
});

app.on("route:showcase", function(id) {
    this.showView($('#main_container'), new CaseEnterView({
        model: new CaseModel()    
    }));    
});

app.on("route:entercase", function() {
    this.showView($('#main_container'), new CaseEnterView({
        model: new CaseModel()    
    }));
});              
              
app.on("route:editcase", function(id) {
    this.showView($('#main_container'), new CaseEditView({
        model: new CaseModel({'id':id})    
    }));
});

app.on("route:registeruser", function() {
    console.log("register user");
});

app.on("route:updateuser", function(id) {
    console.log("update user #"+id);    
});

Backbone.history.start();