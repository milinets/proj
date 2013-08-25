LoginView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<form class="navbar-form navbar-right"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" class="form-control"> \
                            </div> \
                            <button type="submit" class="btn btn-success">Sign in</button> \
                          </form>';
        var template = _.template( texttemplate, {} );
        this.$el.html( template );
    },
    events: {
        "click input[type=button]": "doSearch"
    },
    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        alert( "Search for " + $("#search_input").val() );
    }
});

SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<label>Search</label> \
            <input type="search" id="search_input" /> \
            <input type="button" id="search_button" value="Search" />';
        if this.model('loggedIn') {
            texttemplate = 'Logged in as <%= username %>';
        }
        var template = _.template( texttemplate, {} );
        this.$el.html( template );
    },
    events: {
        "click input[type=button]": "doSearch"
    },
    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        alert( "Search for " + $("#search_input").val() );
    }
});

UserModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        loggedIn: false        
    },
    
    
});

var login_view = new LoginView({ el: $('#login_container')});
var search_view = new SearchView({ el: $('#main_container') });