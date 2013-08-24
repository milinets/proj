<h1>Search</h1>
<div class="searchEntry">

<form action="/searchcase" method="post">
	<div class="grid_6 push_2">
	<label for="search_mrn">Search by Medical Record #</label>
	<input type="text" name="search_mrn" autofocus value="" />
	</div>
	<div class="clear"></div>
	<div class="grid_6 push_2">
	<label for="search_case_title">Search by Case Title</label>
	<input type="text" name="search_case_title" value="" />
	</div>
	<div class="clear"></div>
	<div class="grid_6 push_2">
	<label for="search_all_text">Search all text fields</label>
	<input type="text" name="search_all_text"  value="" />
	</div>
	<div class="clear"></div>
	<div class="grid_12">
	<input type="Submit" value="Search Now!">
	</div>
</form>

%rebase base title='Search cases', session=session, message=message