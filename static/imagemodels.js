ImageModel = Backbone.Model.extend({
    initialize: function(id){
        var that = this;
        alert('/j/image/'+id);
        $.ajax({
            type: 'GET',
            url: '/j/image/'+id,
            success: function(data){
                if (data.error) {
                    console.log(data.error);
                } else {
                    that.set(data);
                }
            }
        });
    }
});

ImageList = Backbone.Collection.extend({
    model: ImageModel
});

ImageListView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.on("change", this.render, this);
    },
    template: _.template(appTemplates.listimage),
    render: function(){
        this.$el.html('<div class="list-group"></div>');
        var that = this;
        this.collection.each(function(record){
            that.$el.find('.list-group').append(that.template(record.attributes));
        });
        return this;
    }
});