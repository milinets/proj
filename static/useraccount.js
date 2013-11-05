appTemplates.accountupdate = hereDoc(function(){/*
<div class="panel panel-default">
  <div class="panel-heading"><h3 class="panel-title">Update User Account</h3></div>
  <div class="panel-body">
  <form id="account_edit" class="form"> 
        <div class="col-sm-4 col-sm-offset-4">
          <label for="email" class="control-label">User Email</label>
          <input type="text" class="form-control" id="email" value = "<%= email %>" />
        </div>

        <div class="col-sm-4 col-sm-offset-4">
          <label for="first_name" class="control-label">First Name</label>
          <input type="text" class="form-control" id="first_name" value="<%= first_name %>"/>
        </div>

        <div class="col-sm-4 col-sm-offset-4">
          <label for="last_name" class="control-label">Last Name</label>
          <input type="text" class="form-control" id="last_name" value="<%= last_name %>"/>
        </div>


        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
        </div>
  </form>
  </div> <!-- panel body -->
</div> <!-- panel -->

<div class = "panel panel-default">
  <div class="panel-body">
<!--    <img src="/static/userimages/<%= picture %>" /> -->
  </div>
</div>


<div class="container">
  <div class="row" style="margin-bottom:10px">
    <div id="profile-image" class="col-sm-4 col-sm-offset-1" style="border:3px dashed gray">
    <p> Hello </p>
      <p class="dz-default dz-message" style="text-align:center">Drag new profile picture here</p>
    <p> Hello </p>
    </div>
  </div>
</div>

*/});


UserAccountView = Backbone.View.extend({
    template: _.template(appTemplates.accountupdate),
    initialize: function(){
        var that = this;
        $.ajax({
          async: false,
          type: 'GET',
          url: '/j/user',
          success: function(data) {
            if (data.error) { humane.log(data.error); }
            else {
              that.model.set(data.user);
            }
          }
        });
    },
    render: function(){
        var that=this;
        this.$el.html( this.template(this.model.attributes) );
        $("#profile-image").dropzone({
            init: function(){
                var dropz= this;
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                    that.render();
                });
            },
            url: "/j/upload_userpic/"+that.model.get('picture'),
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });
        return this;
    },
    events: {
        "change #account_edit": "refresh_case",
        "click #submit_button": "submit_case"
    },
    submit_case: function(event){
        event.preventDefault();
        var that = this;
        var inputs = this.$el.find('.form-control');
        _.each(inputs, function(inpt) { that.model.set(inpt.id, inpt.value) });
        var data = this.model.attributes;
        delete data['loggedIn'];
        $.ajax({
          type: 'PUT',
          url: '/j/user/'+that.model.get('id'),
          data: JSON.stringify(data),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',          
          success: function(data){
            if (data.error) {humane.log(data.error);}
            that.user = data;
            that.render();
          }
        });
    }
});