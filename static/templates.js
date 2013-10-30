function hereDoc(f) {
  return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
}

window.appTemplates = {};

appTemplates.login_template = hereDoc(function(){/*
    <li>
        <a id="login_button" href="#"><span><img src="/static/img/email_sign_in_blue.png"/></span></a>
    </li>
*/});

appTemplates.logout_template = hereDoc(function(){/*
    <li>
        <a id="logout_button" class="btn btn-default" href="#">Log out, <%= email %> </a>
    </li>
*/});

appTemplates.searchform = hereDoc(function(){/*
    <form class="form-horizontal" id="searchForm">
        <div class="form-group">
            <label for="searchterm" class="control-label sr-only">Search</label>
            <div class="col-md-offset-4 col-md-4">
              <input type="search" class="form-control" name="searchterm" id="searchterm" placeholder="Enter Search Term Here"/>
            </div>
            <div class="col-md-4">
              <button class="btn btn-default" id="search_button">Search</button>
            </div>
         </div>
    </form>
*/});
        
appTemplates.listrow = hereDoc(function(){/*
        <a href="#caseread/<%= id %>" class="list-group-item" style="display:block;width:50%;float:left">
            <h4><%= title %></h4>
            <p>MRN: <%= mrn %></p>
            <p>ID: <%= id %></p>
        </a>
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


appTemplates.caseeditview = hereDoc(function(){/*
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
          <label for="needs_follow_up" class="control-label">Needs Follow-up?</label>
          <input type="checkbox" id="needs_follow_up" name="needs_follow_up" checked="<%= needs_follow_up %>"/>
        </div>
        <div class="col-sm-4">
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

appTemplates.casecreateview = hereDoc(function(){/*
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      Case Entry Form
    </h3>
  </div>
  <div class="panel-body">
  <form id="case_entry" class="form-horizontal"> 
      <div class="form-group">
        <div class="col-sm-4">
          <label for="title" class="control-label">Case Title</label>
          <textarea class="form-control" id="title" rows="2" autofocus></textarea>
        </div>
        <div class="col-sm-2">
          <label for="mrn" class="control-label">Medical Record #</label>
          <input type="text" class="form-control" id="mrn" />
        </div>
        <div class="col-sm-2">
          <label for="acc" class="control-label">Accession #</label>
          <input type="text" class="form-control" id="acc" />
        </div>
        <div class="col-sm-4">
          <label for="lname" class="control-label">Last Name</label>
          <input type="text" class="form-control" id="lname" />
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="history" class="control-label">History</label>
          <textarea class="form-control" id="history" rows="2"></textarea>
        </div>
        <div class="col-sm-4">
          <label for="diagnosis" class="control-label">Diagnosis</label>
          <textarea class="form-control" id="diagnosis" rows="2"></textarea>
        </div>
        <div class="col-sm-4">
          <label for="quiz_title" class="control-label">Quiz Title</label>
          <textarea class="form-control" id="quiz_title" rows="2"></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="needs_follow_up" class="control-label">Needs Follow-up?</label>
          <input type="checkbox" id="needs_follow_up" checked="needs_follow_up" />
        </div>
        <div class="col-sm-4">
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
          <button type="reset" id="reset_button" class="btn btn-success">Reset</button>
        </div>
    </div>
  </form>
</div>          
*/});