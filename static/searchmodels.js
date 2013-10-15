SearchView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<form id="searchForm"><label>Search</label> \
            <input type="search" name="searchterm" id="searchterm"/> \
            <input type="submit" id="search_button" value="Search" /></form>';
        var template = _.template( texttemplate, {});
        this.$el.html( template );
    },
    events: {
        "click input[type=submit]": "doSearch"
    },
    clear_input: function(){
        $('#searchterm').val('');
    },
    doSearch: function( event ){
        event.preventDefault();
        var that = this;
        $.post('/j/search', $('#searchForm').serialize(), function(data) {
            that.clear_input();
            console.log(data);
        });
    }
});