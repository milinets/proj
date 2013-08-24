<div class="container">
<form class="container" action="/newcase" method="post">

<h2>Enter a new case</h2>

<div class="well row">
<div class="span6">
	<label for="case_title">Case Title</label>
	<textarea class="span5" name="case_title" rows="2" autofocus>{{form.case_title}}</textarea>
</div>
<div class="span3">
	<label for="mrn">Medical Record #</label>
	<input type="text" name="mrn" value="{{form.mrn}}" />
</div>
<div class="span3">
	<label for="lname">Patient's Last Name</label>
	<input type="text" name="lname" value="{{form.lname}}" />
	<label for="acc">Accession #</label>
	<input type="text" name="acc" value="{{form.acc}}" />
</div>
</div>


<div class="row">
<div class="well span4">
	<label for="history">History</label>
	<textarea name="history">{{form.history}}</textarea>
</div>
<div class="well span4">
	<label for="findings">Findings</label>
	<textarea name="findings">{{form.findings}}</textarea>
</div>
<div class="well span4">
	<label for="discussion">Discussion</label>
	<textarea name="discussion">{{form.discussion}}</textarea>
</div>
</div>

<div class="row">
<div class="span2">
	<label for="needs_follow_up">Needs Follow-up?</label>
	<input type="text" name="needs_follow_up" value="{{form.needs_follow_up}}" />
</div>
<div class="span4 push2">
	<label for="quiz_title">Quiz Title</label>
	<input type="text" name="quiz_title" placeholder="Do not include diagnosis." value="{{form.quiz_title}}" />
</div>
</div>

<div class="clear"></div>
<div class="span4 push4">
	<input type="submit" value="Enter Case" />
</div>	
</form>
<div class="clear"></div>
<div class="imageSection">
</div>
<div class="clear"></div>


</div>



%rebase base title='Enter a new case', session=session, message=message, form=form