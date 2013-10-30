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
		<form id="logprocedure "class="col-sm-6">
			<h3>Log a Procedure</h3>
			<label for=></label>
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