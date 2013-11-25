appTemplates.caseeditview = hereDoc(function(){/*

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
  <div class="panel-heading"><h3 class="panel-title">Case Edit Form</h3></div>
  <div class="panel-body">
  <form id="case_edit" class="form-horizontal"> 
      <div class="form-group">
        <div class="col-sm-4">
          <label for="title" class="control-label">Case Title</label>
          <textarea class="form-control" id="title" rows="2"><%= title %></textarea>
        </div>
        <div class="col-sm-2">
          <label for="mrn" class="control-label">Medical Record #</label>
          <input type="text" class="form-control" id="mrn" value="<%= mrn %>"/>
        </div>
        <div class="col-sm-2">
          <label for="acc" class="control-label">Accession #</label>
          <input type="text" class="form-control" id="acc" value="<%= acc %>"/>
        </div>
        <div class="col-sm-4">
          <label for="lname" class="control-label">Last Name</label>
          <input type="text" class="form-control" id="lname" value="<%= lname %>"/>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="history" class="control-label">History</label>
          <textarea class="form-control" id="history" rows="2"><%= history %></textarea>
        </div>
        <div class="col-sm-4">
          <label for="diagnosis" class="control-label">Diagnosis</label>
          <textarea class="form-control" id="diagnosis" rows="2"><%= diagnosis %></textarea>
        </div>
        <div class="col-sm-4">
          <label for="quiz_title" class="control-label">Quiz Title</label>
          <textarea class="form-control" id="quiz_title" rows="2"><%= quiz_title %></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <input type="checkbox" id="needs_follow_up" name="needs_follow_up" 
            <% var f = needs_follow_up ? 'checked' : '' %> <%= f %>  />
          <label for="needs_follow_up" class="control-label">Needs Follow-up? <div></div></label>
        </div>
        <div class="col-sm-4">
          <%= datadump %>
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
          <button type="reset" id="reset_button" class="btn btn-success">Reset</button>
        </div>
    </div>
  </form>
  </div> <!-- panel body -->
</div> <!-- panel -->

<div class="container">
  <div class="row" style="margin-bottom:10px">
  <div id="image-dropzone" class="col-sm-4 col-sm-offset-1" style="border:3px dashed gray">
    <p class="dz-default dz-message" style="text-align:center">Drag images here</p>
  </div>
  <div id="image-stack-dropzone" class="col-sm-4 col-sm-offset-1" style="border:3px dashed red">
    <p class="dz-default dz-message" style="text-align:center">Drag image stacks here</p>
  </div>  
  </div>
</div>

<div class="panel panel-default">
  <div class="panel-heading"><h3 class="panel-title">Images</h3></div>
  <div id="imagelist" class="panel-body container list-group">

</div>
*/});

appTemplates.listimage_foredit = hereDoc(function(){/*
        <a id="<%= filename %>" href="#editimage/<%= id %>" class="list-group-item" style="display:block;float:left;border:0px">
            <img src="/static/caseimages/<%= filename %>" height="128" width="128">
        </a>
*/});

appTemplates.editimage = hereDoc(function(){/*
        <div id="<%= filename %>" class="list-group-item" style="display:block;float:left">
            <img src="/static/caseimages/<%= filename %>" height="128" width="128">
            <label for="caption" class="control-label"></label>
            <input type="text" id="caption" class="form-control" value="<%= caption %>">
            <button id="submit_button" class="btn btn-success">Submit</button>
        </div>
*/});

appTemplates.editimagemodal = hereDoc(function(){/*
<div id="thismodal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title"><%= caption %></h4>
      </div>
      <div class="modal-body">
        <img src="/static/caseimages/<%= filename %>">
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
*/});

CaseUpdateView = Backbone.View.extend({
    template: _.template(appTemplates.caseeditview),
    initialize: function(){
        var that = this;
        this.model.fetch({
            success: function() {
                that.render();
            },
            error: function(model,xhr,options) {
                app.appAlert('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
        this.model.on("change",this.render,this);
    },
    render: function(){
        var that=this;
        this.$el.html( this.template(this.model.attributes) );        
        $.ajax({
            url: '/j/images/'+ this.model.get('id'),
            type: 'GET',
            success: function(data) {
                if (data.error) {
                    app.appAlert(data.error)
                } else {
                    $('#imagelist').empty()
                    _.each(data, function(image) {
                     $('#imagelist').append(_.template(appTemplates.listimage_foredit,image));
                    });
                }
            }
        });
        $("#image-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                    that.render();
                });
            },
            url: "/j/upload_image_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });
        $("#image-stack-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                    that.render();
                });
            },
            url: "/j/upload_image_stack_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });        
        return this;
    },
    events: {
        "change #case_edit": "refresh_case",
        "click #submit_button": "submit_case",
        "click #reset_button": "reset_case"
    },
    submit_case: function(event){
        event.preventDefault();
        this.model.set({
            title: $("#title").val(),
            mrn: $("#mrn").val(),
            lname: $("#lname").val(),
            acc: $("#acc").val(),
            history: $("#history").val(),
            diagnosis: $("#diagnosis").val(),
            quiz_title: $("#quiz_title").val(),
            needs_follow_up: $("#needs_follow_up").prop('checked')
        });
        this.model.save(null,{
            success: function(model,response,options) {
                app.navigate('caseread/'+model.get('id'), {trigger: true});                
            },
            error: function(model,xhr,options) {
                app.appAlert('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
    },
    reset_case: function(event) {
        this.model.set({});
    }
});