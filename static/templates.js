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
        <a href="#caseread/<%= id %>" class="list-group-item" style="display:block;width:50%%;float:left">
            <h4><%= title %></h4>
            <p>MRN: <%= mrn %></p>
            <p>ID: <%= id %></p>
        </a>
*/});        

appTemplates.caseeditview = hereDoc(function(){/*
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      Case Edit Form
    </h3>
  </div>
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
          <label for="findings" class="control-label">Findings</label>
          <textarea class="form-control" id="findings" rows="2"><%= findings %></textarea>
        </div>
        <div class="col-sm-4">
          <label for="discussion" class="control-label">Discussion</label>
          <textarea class="form-control" id="discussion" rows="2"><%= discussion %></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="needs_follow_up" class="control-label">Needs Follow-up?</label>
          <input type="checkbox" id="needs_follow_up" name="needs_follow_up" value="<%= needs_follow_up %>"/>
        </div>
        <div class="col-sm-4">
          <label for="quiz_title">Quiz Title</label>
          <input type="text" id="quiz_title" name="quiz_title" value="<%= quiz_title %>"/>
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
          <button type="reset" id="reset_button" class="btn btn-success">Reset</button>
        </div>
    </div>
  </form>
</div>
*/});

appTemplates.casereadview = hereDoc(function(){/*
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      Case Edit Form
    </h3>
  </div>
  <div class="panel-body">
  <div class="row">
      <div class="col-sm-4">
          <h3>Title</h3>
          <h4><%= title %></h4>
      </div>
      <div class="col-sm-2">
          <h3>MRN</h3>
          <h4><%= mrn %></h4>
      </div>
      <div class="col-sm-2">
          <h3>ACC</h3>
          <h4><%= acc %></h4>
      </div>
      <div class="col-sm-4">
          <h3>Last Name</h3>
          <h4><%= lname %></h4>
      </div>
  </div>
  <div class="row">
      <div class="col-sm-4">
          <h3>History</h3>
          <p><%= history %></p>
      </div>
      <div class="col-sm-4">
          <h3>Findings</h3>
          <p><%= findings %></p>
      </div>
      <div class="col-sm-4">
          <h3>Discussion</h3>
          <p><%= discussion %></p>
      </div>
  </div>
  <div class="row">
      <div class="col-sm-4">
          <h3>Needs Follow-up</h3>
          <p><%= needs_follow_up %></p>
      </div>
      <div class="col-sm-4">
          <h3>Quiz Title</h3>
          <p><%= quiz_title %></p>
      </div>
      <div class="col-sm-2">
          <button type="submit" id="edit_button" class="btn btn-success">Edit this case</button>
      </div>          
      <div class="col-sm-2">
          <h6>Image upload area.</h3>
          <input id="fileupload" type="file" name="files" data-url="/j/upload_file_to/<%= id %>" multiple>
      </div>
  </div>
</div>
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
          <label for="findings" class="control-label">Findings</label>
          <textarea class="form-control" id="findings" rows="2"></textarea>
        </div>
        <div class="col-sm-4">
          <label for="discussion" class="control-label">Discussion</label>
          <textarea class="form-control" id="discussion" rows="2"></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="needs_follow_up" class="control-label">Needs Follow-up?</label>
          <input type="checkbox" id="needs_follow_up" name="needs_follow_up" />
        </div>
        <div class="col-sm-4">
          <label for="quiz_title">Quiz Title</label>
          <input type="text" id="quiz_title" name="quiz_title" />
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
          <button type="reset" id="reset_button" class="btn btn-success">Reset</button>
        </div>
    </div>
  </form>
</div>          
*/});