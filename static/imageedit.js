appTemplates.imageeditview = hereDoc(function(){/*

<style type="text/css">
  input[type=checkbox] {
    display: none;
  }
  input:checked + label div {
    width: 50px;
    height: 50px;
    background-image: url('static/images/checkbox.png');
    background-size: 100%;
  }
  input:not(:checked) + label div {
    width: 50px;
    height: 50px;
    background-image: url('static/images/checkbox_empty.png');
    background-size: 100%;
  }
</style>


<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      Image Edit
    </h3>
  </div>
  <div class="panel-body">
  <img src="/static/caseimages/<%= filename %>" />
  <form id="image_entry" class="form form-horizontal"> 
      <div class="form-group">
        <div class="col-sm-8">
          <label for="caption" class="control-label">Caption</label>
          <textarea class="form-control" id="caption" rows="2" autofocus><%= caption %></textarea>
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Update caption</button>
          <button type="reset" id="delete_button" class="btn">Delete image</button>
        </div>
    </div>
  </form>
</div>          
*/});

ImageModel = Backbone.Model.extend({
});

ImageEditView = Backbone.View.extend({
    template: _.template(appTemplates.imageeditview),
    initialize: function(){      
    },
    render: function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    events: {
        "click #submit_button": "update_image",
        "click #delete_button": "delete_image"
    },
    update_image: function(event){
        var that = this;
        event.preventDefault();
        var inputs = this.$el.find('.form-control');
        _.each(inputs, function(inpt) { that.model.set(inpt.id,inpt.value) });
        $.ajax({
          type: 'PUT',
          url: '/j/image/'+that.model.get('id'),
          data: JSON.stringify(that.model.attributes),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          success: function(data){
            if (data.error) {app.appAlert(data.error);}
            else {
              app.navigate('#caseread/'+that.model.get('tfcase'), {trigger: true});
            }
          }
        });
    },
    delete_image: function(event) {
        var that = this;
        if (confirm('Are you sure you want to delete this image?')) {
          $.ajax({
            type: 'DELETE',
            url: '/j/image/'+that.model.get('id'),
            data: JSON.stringify(that.model.attributes),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
              if (data.error) {app.appAlert(data.error);}
              else {
                app.navigate('#caseread/'+that.model.get('tfcase'), {trigger: true});
              }
            }
          });
        }
    }
});