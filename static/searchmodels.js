appTemplates.searchform = hereDoc(function(){/*
    <form class="form-horizontal" id="searchForm">
        <div class="form-group">
            <label for="searchterm" class="control-label sr-only">Search</label>
            <div class="col-md-offset-3 col-md-3">
              <input type="search" class="form-control" name="searchterm" id="searchterm" placeholder="Enter Search Term Here"/>
            </div>
            <div class="col-md-3">
              <button class="btn btn-default" id="search_button">Search</button>
            </div>
            <div>
                <input type="checkbox" id="images_only" name="images_only" checked />
                <label for="images_only" class="control-label">Only show cases with images?</label>
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
        $('#images_only').prop('checked',true);
    },
    doSearch: function( event ){
        event.preventDefault();
        var searchterm = $('#searchterm').val();
        var images_only = $('#images_only').prop('checked');
        if (searchterm == '' && images_only) {
            var searchfunc = '/j/searchallwithimages';
            var opts = {};
        } else if (searchterm == '') {
            var searchfunc = '/j/searchall';
            var opts = {};
        } else if (images_only) {
            var searchfunc = '/j/search';
            var opts = {searchterm: searchterm, images_only: true};
        } else {
            var searchfunc = '/j/search';
            var opts = {searchterm: searchterm, images_only: false};
        }
        var that = this;
        $.post(searchfunc, opts, function(data) {
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