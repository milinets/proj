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
        quiz_title: '',
        images: []
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
        $("#image-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("addedfile", function(file) {
                    console.log(file);
                });
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                });
            },
            url: "/j/upload_image_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });
        $("#image-stack-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("addedfile", function(file) {
                    console.log(file);
                });
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                });
            },
            url: "/j/upload_image_stack_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });
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
                humane.log('Status text: '+xhr.statusText+', Status code: '+xhr.status);
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
            error: function(model,xhr,options) {
                humane.log('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
        this.model.on("change",this.render,this);
    },
    render: function(){
        this.$el.html( this.template(this.model.attributes) );
        $.ajax({
            type : 'GET',
            url : '/j/images/'+this.model.id,
            dataType : 'json',
            success : function(data){
                        $('#imagelist').empty;
                        _.each(data, function(file){
                               $('#imagelist').append(_.template(appTemplates.listimage,file));
                            });
            }
        });  

        return this;
    },
    events: {
        "click #edit_button": "doEdit",
        "click #delete_button": "doDelete"
    },
    doEdit: function(event){
        app.navigate('caseupdate/'+this.model.id, {trigger: true});
    },
    doDelete: function(event){
        $.ajax({
            url: '/j/case/'+this.model.id,
            type: 'DELETE',
            success: function(data){
                if (data.error) {
                    humane.log(data.error)
                } else {
                    $('#main_container').html('<h3>Case deleted!</h3>');
                }
            }
        });
    }
});


CaseUpdateView = Backbone.View.extend({
    template: _.template(appTemplates.caseeditview),
    initialize: function(){
        var that = this;
        this.model.fetch({
            success: function() {
                that.render();
            },
            error: function(model,xhr,options) {
                humane.log('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
        this.model.on("change",this.render,this);
    },
    render: function(){
        var that=this;
        $.ajax({
            url: '/j/images/'+ this.model.get('id'),
            type: 'GET',
            success: function(data) {
                if (data.error) {
                    humane.log(data.error)
                } else {
                    $('#imagelist').empty()
                    _.each(data, function(image) {
                     $('#imagelist').append(_.template(appTemplates.listimage,image));
                    });
                }
            }
        });
        this.$el.html( this.template(this.model.attributes) );
        var that=this;
        $("#image-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                    that.render();
                });
            },
            url: "/j/upload_image_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });
        $("#image-stack-dropzone").dropzone({
            init: function(){
                var dropz= this;
                this.on("complete", function(file) {
                    dropz.removeFile(file);
                    that.render();
                });
            },
            url: "/j/upload_image_stack_to/"+this.model.id,
            clickable: true,
            acceptedFiles: 'image/*',
            autoProcessQueue: true
        });        
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
                humane.log('Status text: '+xhr.statusText+', Status code: '+xhr.status);
            }
        });
    },
    reset_case: function(event) {
        this.model.set({});
    }
});