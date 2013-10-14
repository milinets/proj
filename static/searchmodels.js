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
        event.preventDefault();
        $.post('/j/search', $('#searchForm').serialize(), function(data) {
            console.log(data);
        });
    }
});