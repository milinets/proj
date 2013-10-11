CaseModel = Backbone.Model.extend({
    defaults: {
        id: '',
        lname: '',
        mrn: ''
    },
    urlRoot : '/j/case/',
    initialize : function(){
        this.fetch();
    },
    update : function() {
        this.save();
    },
    remove : function() {
        this.save();
        this.unset('id');
    }
});

CaseShowView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<form"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" id="username_input" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" id="password_input" class="form-control"> \
                            </div> \
                            <button type="submit" id="login_button" class="btn btn-success">Sign in</button> \
                          </form>';
        
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
        return this;
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function(event){
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        this.model.logout();
    }
});

CaseEnterView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<form"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" id="username_input" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" id="password_input" class="form-control"> \
                            </div> \
                            <button type="submit" id="login_button" class="btn btn-success">Sign in</button> \
                          </form>';
        
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
        return this;
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function(event){
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        this.model.logout();
    }
});

CaseEditView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<form"> \
                            <div class="form-group"> \
                              <input type="text" placeholder="Email" id="username_input" class="form-control"> \
                            </div> \
                            <div class="form-group"> \
                              <input type="password" placeholder="Password" id="password_input" class="form-control"> \
                            </div> \
                            <button type="submit" id="login_button" class="btn btn-success">Sign in</button> \
                          </form>';
        
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
        return this;
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function(event){
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        this.model.logout();
    }
});