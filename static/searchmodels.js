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
            humane.log('Search term must be more than 1 character');
            return
        }
        var that = this;
        $.post('/j/search', {searchterm: $('#searchterm').val()}, function(data) {
            that.clear_input();
            app.navigate('blank',true);
            if (data.error) {
                humane.log(data.error);
                return
            }
            if (data.length==0) {
                $('#main_container').html("<h3>No cases found!</h3");
            } else {
                window.casesList.reset(data);
                app.navigate('searchresult', {trigger: true});
            }
        });
    }
});

CaseListView = Backbone.View.extend({
    template: _.template(appTemplates.listrow),
    render: function(){
        this.$el.html('<div class="list-group"></div>');
        var that = this;
        this.collection.each(function(record){
            that.$el.find('.list-group').append(that.template(record.attributes));
        });
        return this;
    }
});