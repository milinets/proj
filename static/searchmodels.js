SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<form class="form-horizontal" id="searchForm"> \
            <div class="form-group"> \
              <label for="searchterm" class="control-label sr-only">Search</label> \
              <div class="col-md-offset-4 col-md-4"> \
              <input type="search" class="form-control" name="searchterm" id="searchterm" placeholder="Enter Search Term Here"/> \
              </div> \
              <div class="col-md-4"> \
              <button type="submit" class="btn btn-default" id="search_button">Search</button> \
              </div> \
            </div> \
            </form> \
            ';
        var template = _.template( texttemplate, {});
        this.$el.html( template );
    },
    events: {
        "click button[type=submit]": "doSearch"
    },
    clear_input: function(){
        $('#searchterm').val('');
    },
    doSearch: function( event ){
        event.preventDefault();
        if ($('#searchterm').val().length < 2) {
            humane.log('Search term must be more than 1 character');
            return
        }
        var that = this;
        $.post('/j/search', $('#searchForm').serialize(), function(data) {
            that.clear_input();
            if (data.length==0) {
                $('#notfound').html('<h6>Search term was not found.</h6>');
            } else {
                $('#notfound').empty();
            }
            app.casesList = new CaseList(data);
            app.showView($('#main_container'), (new CaseListView({collection: app.casesList})));
        });
    }
});

CaseListView = Backbone.View.extend({
    events: {
        "click .caserow": "clickrow"
    },
    render: function(){
        var that = this;
        this.collection.each(function(record){
            that.$el.append(that.rendercase(record));
        });
        return this;
    },
    rendercase: function(record){
        var texttemplate='<div class="caserow" id="<%= id %>">Title: <%= title %>, MRN: <%= mrn %>, ACC: <%= acc %></div>';
        return _.template(texttemplate, record.attributes);
    },
    clickrow: function(event){
        app.navigate('caseread/'+event.target.id, {trigger: true});
    }
});