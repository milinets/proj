appTemplates.searchform = hereDoc(function(){/*
    <form class="form-horizontal" id="searchForm">
        <div class="form-group">
            <label for="searchterm" class="control-label sr-only">Search</label>
            <div class="col-md-offset-4 col-md-4">
              <input type="search" class="form-control" name="searchterm" id="searchterm" placeholder="Enter Search Term Here"/>
            </div>
            <div class="col-md-4">
              <button class="btn btn-default" id="search_button">Search</button>
            </div>
         </div>
    </form>
*/});
        
appTemplates.listrow = hereDoc(function(){/*
        <a href="#caseread/<%= id %>" class="list-group-item" style="display:block;width:100%;float:left">
            <h4><%= title %></h4>
            <p>MRN: <%= mrn %></p>
            <p>ID: <%= id %></p>
        </a>
*/});

SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    template: _.template(appTemplates.searchform),
    render: function(){
        this.$el.html(this.template());
    },
    events: {
        "click #search_button": "doSearch"
    },
    clear_input: function(){
        $('#searchterm').val('');
    },
    doSearch: function( event ){
        event.preventDefault();
        if ($('#searchterm').val().length < 2) {
            app.appAlert('Search term must be more than 1 character');
            return
        }
        var that = this;
        $.post('/j/search', {searchterm: $('#searchterm').val()}, function(data) {
            that.clear_input();
            app.navigate('blank',true);
            if (data.error) {
                app.appAlert(data.error);
                return
            }
            if (data.length==0) {
                $('#main_container').html("<h3>No cases found!</h3");
            } else {
                app.casesList = data;
                app.navigate('searchresult', {trigger: true});
            }
        });
    }
});