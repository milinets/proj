appTemplates.casereadview = hereDoc(function(){/*
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
<div id="thismodalcontainer"></div>
*/});

appTemplates.listimage = hereDoc(function(){/*
        <a id="<%= filename %>" href="/static/caseimages/<%= filename %>" class="list-group-item" style="display:block;float:left;border:0px">
            <img src="/static/caseimages/<%= filename %>" height="128" width="128">
        </a>
*/});


appTemplates.listimagemodal = hereDoc(function(){/*
<div id="thismodal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title"><%= caption %></h4>
      </div>
      <div class="modal-body">
        <div class="container">
          <div class="row">
            <img class="col-md-12" src="/static/caseimages/<%= filename %>">
          </div>
        </div>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
*/});

CaseReadView = Backbone.View.extend({
    template: _.template(appTemplates.casereadview),
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
        this.model.on("change",this.render,this);
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
        "click #edit_button": "doEdit",
        "click #delete_button": "doDelete",
        "click #imagelist a" : "showmodal"
    },
    showmodal: function(event){
        event.preventDefault();
        var that=this;
        filename = $(event.target).closest('a').attr('id');
        thisimage = $.grep(this.imagelist, function(e){return e.filename === filename})[0];
        maxidx = this.imagelist.length - 1;
        idx = thisimage.key;
        $('#thismodalcontainer').html(_.template(appTemplates.listimagemodal,thisimage));
        $('#thismodal').modal('show');
        $('#thismodal').on('hide.bs.modal', function() {
            $('body').unbind('mousewheel');
        });
        $('body').bind('mousewheel',function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            idx = idx + delta;
            if (idx < 0) idx = maxidx;
            if (idx > maxidx) idx = 0;
            $('#thismodal img').attr('src','/static/caseimages/'+that.imagelist[idx].filename);
            $('#thismodal h4').html(that.imagelist[idx].caption);
        }); 
    },
    doEdit: function(event){
        app.navigate('caseupdate/'+this.model.id, {trigger: true});
    },
    doDelete: function(event){
        if (confirm("Really delete this case?")) {
            $.ajax({
                url: '/j/case/'+this.model.id,
                type: 'DELETE',
                success: function(data){
                    if (data.error) {
                        humane.log(data.error)
                    } else {
                        $('#main_container').html('<h3>Case deleted!</h3>');
                    }
                }
            });
        }
    }
});
