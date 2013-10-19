CaseModel = Backbone.Model.extend({
    defaults: {
        title: '',        
        lname: '',
        mrn: '',
        acc: '',
        findings: '',
        history: '',
        discussion: '',
        needs_follow_up: '',
        quiz_title: ''
    },
    urlRoot: '/j/case',
    validate: function(attrs,options){
        if (!(attrs.title)) {
            return "A title is required";
        };
    }
});

CaseList = Backbone.Collection.extend({
    model: CaseModel
});

CaseCreateView = Backbone.View.extend({
    template: _.template(appTemplates.casecreateview),    
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html( this.template() );
      return this;
    },
    events: {
        "change #case_entry": "refresh_case",
        "click #submit_button": "submit_case",
        "click #reset_button": "reset_case"
    },
    refresh_case: function(){
        this.model.set({
            title: $("#title").val(),
            mrn: $("#mrn").val(),
            lname: $("#lname").val(),
            acc: $("#acc").val(),
            history: $("#history").val(),
            findings: $("#findings").val(),
            discussion: $("#discussion").val(),
            needs_follow_up: $("#needs_follow_up").checked,
            quiz_title: $("#quiz_title").val(),
        });
    },
    submit_case: function(event){
        event.preventDefault();
        this.model.save(null,{
            success: function(model,response,options) {
                app.navigate('caseread/'+model.get('id'), {trigger: true});                
            },
            error: function(model,xhr,options) {
                console.log('Case not saved: '+(xhr.statusText) +' '+ (xhr.status));
            }
        });
    },
    reset_case: function(event) {
        this.model.clear();
    }
});

CaseReadView = Backbone.View.extend({
    template: _.template(appTemplates.casereadview),
    initialize: function(){
        var that = this;
        this.model.fetch({
            success: function() {
                that.render();
            },
            error: function(model,response,options) {
                console.log('Could not retrieve case '+ response.status);
            }
        });
        this.model.on("change",this.render,this);
    },
    render: function(){
        this.$el.html( this.template(this.model.attributes) );
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
        return this;
    },
    events: {
        "click #edit_button": "doEdit",
    },
    doEdit: function(event){
        app.navigate('caseupdate/'+this.model.id, {trigger: true});
    },
});


CaseUpdateView = Backbone.View.extend({
    template: _.template(appTemplates.caseeditview),
    initialize: function(){
        var that = this;
        this.model.fetch({
            success: function() {
                that.render();
            },
            error: function(model,response,options) {
                console.log('Could not retrieve case '+ response.status);
            }
        });
        this.model.on("change",this.render,this);
    },
    render: function(){
        this.$el.html( this.template(this.model.attributes) );
        return this;
    },
    events: {
        "change #case_edit": "refresh_case",
        "click #submit_button": "submit_case",
        "click #reset_button": "reset_case"
    },
    refresh_case: function(){
        this.model.set({
            title: $("#title").val(),
            mrn: $("#mrn").val(),
            lname: $("#lname").val(),
            acc: $("#acc").val(),
            history: $("#history").val(),
            findings: $("#findings").val(),
            discussion: $("#discussion").val(),
            needs_follow_up: $("#needs_follow_up").checked,
            quiz_title: $("#quiz_title").val(),
        });
    },
    submit_case: function(event){
        event.preventDefault();
        this.model.save(null,{
            success: function(model,response,options) {
                app.navigate('caseread/'+model.get('id'), {trigger: true});                
            },
            error: function(model,xhr,options) {
                console.log('Case not saved: '+(xhr.statusText) +' '+ (xhr.status));
            }
        });
    },
    reset_case: function(event) {
        this.model.set({});
    }
});