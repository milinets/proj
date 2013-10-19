LoginView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    login_template: _.template(window.appTemplates.login_template),
    logout_template: _.template(window.appTemplates.logout_template),
    render: function(){
        if (this.model.get('loggedIn')) {
            this.$el.html( this.logout_template(this.model.attributes) );
        } else {
            this.$el.html( this.login_template(this.model.attributes) );
        }
    },
    events: {
        "click #login_button": "doLogin",
        "click #logout_button": "doLogout"
    },
    doLogin: function(event){
        event.preventDefault();
        this.model.set({
            username : $("#username_input").val(),
            password : $("#password_input").val()
        });
        this.model.login();
    },
    doLogout: function(event) {
        event.preventDefault();
        this.model.logout();
    }
});

UserModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        loggedIn: false        
    },
    initialize: function() {
        var that = this;
        $.get('/j/login', function(data){
            that.set(data);
        });
    },
    login : function() {
        var that = this;
        $.post('/j/login', that.attributes, function(data){
            if (data) {
                that.set(data);
            }
        });
    },
    logout : function() {
        var that = this;
        $.post('/j/logout', function(data){
            that.set(data);
        });
    }
});