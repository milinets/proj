appTemplates.casedeleteview = hereDoc(function(){/*
<div class="col-sm-4">
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      <%= title %>
    </h3>
  </div>
  <div class="panel-body">
          <h5>History</h5>
          <p><%= history %></p>
          <h5>Findings</h5>
          <p><%= findings %></p>
          <h5>Diagnosis</h5>
          <p><%= diagnosis %></p>
          <button id="edit_button" class="btn btn-success">Edit this case</button>
          <button id="delete_button" class="btn btn-success">Delete this case</button>
  </div>
</div>
</div>
<div id="imagelist" class="list-group">
    <h5>Image List area</h5>
</div>
<div id="thismodalcontainer">
  <h3>Are you sure you want to delete this case?</h3>



</div>
*/});


CaseDeleteView = Backbone.View.extend({
    template: _.template(appTemplates.casedeleteview),
    initialize: function(){
        var that = this;
        this.model.fetch({
            success: function() {
                that.render();
            },
            error: function(model,xhr,options) {
                humane.log('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
    },
    render: function(){
        var that = this;
        this.$el.html( this.template(this.model.attributes) );
        $.ajax({
            url: '/j/images/'+ this.model.get('id'),
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.error) {
                    humane.log(data.error)
                } else {
                    $('#imagelist').empty()
                    that.imagelist = [];
                    _.each(data, function(image, key) {
                        that.imagelist.push({
                            'key':key,
                            'filename':image.filename,
                            'caption':image.caption || 'No caption found.'});
                        image['key'] = key;
                        $('#imagelist').append(_.template(appTemplates.listimage,image));
                    });
                }
            }
        });

        return this;
    },
    events: {

    },
});