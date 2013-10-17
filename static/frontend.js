window.user = new UserModel({});
window.login_view = new LoginView({ el: $('#login_container'),model:window.user});
window.search_view = new SearchView({ el: $('#searchbox') });


var AppRouter = Backbone.Router.extend({
        routes: {
            "home": "home",
            "about": "about",
            "casecreate": "casecreate",
            "caseread/:id": "caseread",
            "caseupdate/:id": "caseupdate",
            "listallcases": "listallcases",
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
    humane.log('hello');
});
    
app.on("route:about", function() {
    $("#main_container").html("<h2>About this site</h2>");
    humane.log('about');
});

app.on("route:casecreate", function() {
    this.showView($('#main_container'), new CaseCreateView({
        model: new CaseModel()    
    }));
});   

app.on("route:caseread", function(id) {
    this.showView($('#main_container'), new CaseReadView({
        model: new CaseModel({'id': id})    
    }));    
});
              
app.on("route:caseupdate", function(id) {
    this.showView($('#main_container'), new CaseUpdateView({
        model: new CaseModel({'id':id})    
    }));
});

app.on("route:listallcases", function() {
    var that=this;
    $.get("/j/searchall", function(data){
        app.casesList = new CaseList(data);
        that.showView($('#main_container'), new CaseListView( {collection: app.casesList} ));
    });
});

app.on("route:registeruser", function() {
    console.log("register user");
});

app.on("route:updateuser", function(id) {
    console.log("update user #"+id);    
});

Backbone.history.start();