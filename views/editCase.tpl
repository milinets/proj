%include header title="Editing: "+case.case_title
<!-- Inputs: session, title, message -->

<body style="padding:70px">

%include navbar session=session

%include messages message=message

<form action="/editcase/{{case.case_id}}" method="post">
  <fieldset>
    <legend>{{case.case_title}}</legend>

  <div class="row-fluid">

    <div class="span3">
        <label class="label label-info">Case Title</label>
        <textarea name="case_title">{{form.case_title}}</textarea>
    
        <label class="checkbox">
          <input type="checkbox" name="needs_follow_up" {{"checked" if case.needs_follow_up else ''}} value="True" />
          Needs Follow-Up? 
        </label>
        <hr>
        <label class="label label-info">Last Name</label>
        <input type="text" name="lname" value="{{form.lname}}" />
        <hr>    
        <label class="label label-info">Medical Record Number</label>
        <input type="text" name="mrn" value="{{form.mrn}}" />
        <hr>
        <label class="label label-info">Accession Number</label>
        <input type="text" name="acc" value="{{form.acc}}" />
    </div>

    <div class="span8 offset1">
      <blockquote>
        <label class="label label-info">History</label>
        <textarea class="span12" rows="4" name="history">{{form.history}}</textarea>
      </blockquote>      

      <blockquote>
      <label class="label label-info">Findings</label>
      <textarea class="span12" rows="4" name="findings">{{form.findings}}</textarea>
      </blockquote>

      <blockquote>
      <label class="label label-info">Discussion</label>
      <textarea class="span12" rows="4" name="discussion">{{form.discussion}}</textarea>
      </blockquote>
    </div>

  </div> <!-- row-fluid -->

  <div class="row-fluid pagination-centered">
    <input class="btn btn-primary" type="submit" value="Update Case" />
    <a class="btn" href="/showcase/{{case.case_id}}">Abandon Changes</a> 
  </div>

  </fieldset>
</form>

  <script src="http://code.jquery.com/jquery-latest.js"></script>
  <script src="/js/bootstrap.min.js"></script>
</body>
</html>