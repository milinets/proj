<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{get('title','No title yet')}}</title>
  <!-- Bootstrap -->
  <link href="/css/bootstrap.min.css" rel="stylesheet" media="screen">
</head>
<body style="padding:100px">

%include navbar session=session

%if get('message',None):
  <div class="row-fluid">
    <div class="span12">
      %for i in message: 
        <p>{{i}}</p>
      %end
    </div>
  </div>
%end

<div class="row-fluid">
  <div class="span12">
   
<h1>{{case.case_title}}</h1>

<div>

	<label for="case_title">Case Title</label>
	{{case.case_title}}

	<label for="mrn">Medical Record #</label>
	{{case.mrn}}

	<label for="lname">Patient's Last Name</label>
	{{case.lname}}

	<label for="acc">Accession #</label>
	{{case.acc}}

	<label for="history">History</label>
	{{case.history}}

	<label for="findings">Findings</label>
	{{case.findings}}

	<label for="discussion">Discussion</label>
	{{case.discussion}}

	<label for="needs_follow_up">Needs Follow-up?</label>
	{{case.needs_follow_up}}

	<label for="quiz_title">Quiz Title</label>
	{{case.quiz_title}}

	<p>
		<a href="/editcase/{{case.case_id}}">Edit this case</a>
	</p>
</div>	

<input id="fileupload" type="file" name="files" data-url="/upload_file_to/{{case.case_id}}" multiple>

</div>
</div>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="/js/jquery.ui.widget.js"></script>
<script src="/js/jquery.iframe-transport.js"></script>
<script src="/js/jquery.fileupload.js"></script>
<script>
$(function () {
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    });
});
</script>
</body> 
</html>