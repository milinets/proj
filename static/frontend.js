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
            "editimage/:id": "editimage",
            "listallcases": "listallcases",
            "listallcaseswithimages": "listallcaseswithimages",
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
        },
        appAlert: function(alertText) {
            console.log(alertText);
            $('#errormessage').addClass('alert alert-danger text-center');
            $('#errormessage').hide().html('<p>'+alertText+'</p>').fadeIn(1000).fadeOut(1000);
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
    this.appAlert('about');
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

app.on("route:editimage", function(id) {
    var that = this;
    $.ajax({
        type: 'GET',
        url: '/j/image/'+id,
        success: function(data) {
            if (data.error) {app.appAlert(data.error);}
            else {
                that.showView($('#main_container'), new ImageEditView({model: new ImageModel(data)}));
            }
        }
    });
});

app.on("route:searchresult",function(){
    $('#main_container').html('<div id="searchresult" class="list-group"></div>');
    _.each(app.casesList, function(datum) {
        $('#searchresult').append(_.template(appTemplates.listrow,datum));
    });
});

app.on("route:listallcases", function() {
    var that=this;
    $.get("/j/searchall", function(data){
        if (data.error) {
            app.appAlert(data.error);
            return
        } else {
            app.casesList = data;
            app.navigate('#searchresult', {trigger: true});
        }
    });
});

app.on("route:listallcaseswithimages", function() {
    var that=this;
    $.get("/j/searchallwithimages", function(data){
        if (data.error) {
            app.appAlert(data.error);
            return
        } else {
            app.casesList = data;
            app.navigate('#searchresult', {trigger: true});
        }
    });
});

app.on("route:user", function() {
    if (!window.user.get('loggedIn')) {
        app.appAlert('Please log in first.');
        app.navigate('#home');
    } else {
    this.showView($('#main_container'), new UserAccountView({model: window.user}));
    }
});

Backbone.history.start();