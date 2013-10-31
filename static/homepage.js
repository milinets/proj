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
		</div>
		<button type="submit" id="submit_log" class="btn btn-success">Log Procedure</button>
		</form>
		<form id="entercase" class="col-sm-6">
			<h3>Enter a Case</h3>
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
    	if (window.user.get('loggedIn')) {
    		this.$el.html ( this.homepage_template() );
    	} else {
    		this.$el.html ( this.loginfirst_template() );
    	}
        return this;
    },
    events: {
    }
});