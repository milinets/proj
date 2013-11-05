window.user = new UserModel;
window.login_view = new LoginView({ el: $('#login_container'),model:window.user});
window.search_view = new SearchView({ el: $('#searchbox') });
window.casesList = new CaseList;

var AppRouter = Backbone.Router.extend({
        routes: {
            "home": "home",
            "about": "about",
            "casecreate": "casecreate",
            "caseread/:id": "caseread",
            "caseupdate/:id": "caseupdate",
            "listallcases": "listallcases",
            "searchresult": "searchresult",
            "user": "user",
            "blank": "blank"
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

app.on("route:blank", function(){});

app.on("route:home", function() {
    this.showView($('#main_container'), new HomePageView());
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

app.on("route:searchresult",function(){
    this.showView($('#main_container'), new CaseListView({collection: window.casesList}) );
});

app.on("route:listallcases", function() {
    var that=this;
    $.get("/j/searchall", function(data){
        if (data.error) {
            humane.log(data.error);
            return
        }
        window.casesList.reset(data);
        that.showView($('#main_container'), new CaseListView( {collection: window.casesList} ));
    });
});

app.on("route:user", function() {
    this.showView($('#main_container'), new UserAccountView({model: window.user}));
});


Backbone.history.start();