%rebase base title=get('title',"Home Page"), session=session, message=message

<style type="text/css">
	#quicksearch form {padding: 20px;}
	#quicksearch input[type="search"] {width: 100%;}
	#quicksearch input[type="Submit"] {display: block;}
</style>

<div class="row-fluid well pagination-centered">
	<h2>Case of the Month</h2>
	<h5>November</h5>
	<img src="http://placedog.com/g/320/300">
	<img src="http://placedog.com/g/320/300">
	<img src="http://placedog.com/g/320/300">
</div>

<div class="row-fluid pagination-centered">

	<div id="quicksearch" class="span4 well">
		<form action="/searchcase" method="post">
			<label for="search_all_text"><h3>Search the Teaching File</h3></label>
			<input type="search" name="search_all_text"  value="" />
			<input type="submit" value="Search Now!">
		</form>
	</div>

	<div id="logcase" class="span4 well">
		<form action="/logcase" method="post">
			<label for="acc">Case Accession Number</label>
			<input type="text" name="acc" value="" />
			<label for="procedure">Procedure Type</label>
			<select name="procedure" id="procedure">
				<option>Select Something</option>
				<option value='Lumbar Puncture'>Lumbar Puncture</option>
				<option value='Myelogram'>Myelogram</option>
				<option value='Intrathecal Chemotherapy'>Intrathecal Chemotherapy</option>
				<option value='Cerebral Angiogram'>Cerebral Angiogram</option>
				<option value='Lumbar Drain'>Lumbar Drain</option>
				<option value='Spinal Angiogram'>Spinal Angiogram</option>
				<option value='Aneurysm Embolization'>Aneurysm Embolization</option>
				<option value='Stenting'>Stenting Procedure</option>
			</select>
			<label for="procdate">Date of Procedure</label>
			<input name="procdate" type="date" value="2010-12-16" />
			<input type="submit" value="Log this Procedure" />
		</form>
	</div>

	<div class="span4 well">
		%if session.get('username'):
          <div id="quicklinks">
          	Quicklinks
          </div>
        %else:
          <form method="post" action="/login">
            <input name="username" id="username" type="text" value="{{get('lastuser','')}}" autofocus class="input-small" placeholder="Username" />
            <input name="password" id="password" type="password" value="" class="input-small" placeholder="Password" />
            <br>
            <button type="submit" class="btn">Sign In</button>
          </form>
        %end
	</div>

</div>
