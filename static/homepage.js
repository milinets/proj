appTemplates.loginfirst = hereDoc(function(){/*
<div class="jumbotron">
	<div class="container">
		<h1>You are not logged in!</h1>
		<p>Please log in to access the site.</p>
		<p><a id="big_login_button" href="#"><span><img src="/static/img/email_sign_in_blue.png"/></span></a></p>
	</div>
</div>
*/});

appTemplates.homepage = hereDoc(function(){/*
	<style type="text/css">
		#logprocedure, #entercase {
			border: 1px dotted blue;
		}
		input, select {
			margin-bottom: 5px;
		}
		button {
			margin: auto;
		}
	</style>
	<div class="row">
		<form id="logprocedure" role="form" class="col-sm-3 col-sm-offset-2">
		<div class="form-group">
			<h3>Log a Procedure</h3>
			<label for="acc" class="control-label sr-only">Procedure accession number</label>
			<input id="acc" type="text" placeholder="Accession Number" class="form-control" />
			<label for="procedure type" class="control-label sr-only">Procedure type</label>
			<select id="procedure type" class="form-control">
				<option value="lumbar puncture">Lumbar Puncture</option>
				<option value="intrathecal chemo">Intrathecal Chemotherapy</option>
				<option value="lumbar drain">Lumbar drain placement</option>
				<option value="ct biopsy">CT-guided biopsy</option>
				<option value="us biopsy">Ultrasound-guided biopsy</option>
				<option value="epidural injection">Epidural injection</option>
				<option value="facet injection">Facet injection</option>
				<option value="cerebral angiogram">Cerebral angiogram</option>
				<option value="spinal angiogram">Spinal angiogram</option>
				<option value="other">Other</option>
			</select>
			<label for="date" class="control-label sr-only">Date of procedure</label>
			<input type="date" class="form-control" id="date" />
			<button type="submit" id="submit_log" class="btn btn-success">Log Procedure</button>
		</div>
		</form>
		<form id="entercase" role="form" class="col-sm-3 col-sm-offset-1">
		<div class="form-group">
			<h3>Enter a Case</h3>
			<label for="title" class="control-label sr-only">Case Title</label>
			<input id="title" type="text" placeholder="Case Title" class="form-control" />
			<label for="mrn" class="control-label sr-only">Case Title</label>
			<input id="mrn" type="text" placeholder="Medical Record Number" class="form-control" />
			<label for="diagnosis" class="control-label sr-only">Diagnosis</label>
			<input id="diagnosis" type="text" placeholder="Diagnosis" class="form-control" />
			<button type="submit" id="submit_case" class="btn btn-success">Submit Case</button>
		</div>
		</form>
	</div>
*/});

HomePageView = Backbone.View.extend({
    loginfirst_template: _.template(appTemplates.loginfirst),
    homepage_template: _.template(appTemplates.homepage),
    initialize: function(){
      this.render();
      window.user.on('change', this.render, this);
    },
    render: function(){
   		this.$el.html ( this.homepage_template() );
        return this;
    },
    events: {
    	"click #submit_case": "submitcase"
    },
    submitcase : function(event){
    	event.preventDefault();
        var inputs = this.$el.find('#entercase .form-control');
        var form_obj = _.reduce(inputs, function(memo,elem){
        	memo[elem.id] = elem.value; return memo
        }, {});
        console.log(form_obj);
        $.ajax({
        	type: "POST",
        	url: "/j/case",
        	contentType: 'application/json',
        	dataType: 'json',
        	data: JSON.stringify(form_obj)
        })
        .done(function(data){
        	if (data.error) {humane.log(data.error)}
        	else {app.navigate('caseupdate/'+data.id, {trigger: true});} 
        	});
    }
});