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
    },
    case_create: function(){
        console.log(this.attributes);
        this.save(this.attributes, {
            success: function(model,response,options){
                app.navigate('caseread/'+model.get('id'), {trigger: true});
            },
            error: function(model,xhr,options){
                console.log('Case creation failed. '+xhr);
            }
        });
    },
    case_read: function(id){
        $.get('/j/caseread/'+id, function(data) {
            this.set(data);
        });
    },
    case_update: function(id){
        $.ajax({
            type: 'PUT',
            url: '/j/caseupdate/'+id,
            data: (this.toJSON())
        })
        .done(function(data){
            console.log('updated: '+data);
            return true;
        })
        .fail(function(jqXHR,text){
            console.log('failed to update: '+text);
        });
    },
    case_delete: function(){}
});

CaseCreateView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var texttemplate='<form id="case_entry"> \
                            <div class="form-group"> \
                              <label for="title">Case Title</label>\
                              <textarea id="title" name="title" rows="2" autofocus></textarea>\
                              <label for="mrn">Medical Record Number</label>\
                              <input type="text" id="mrn" name="mrn" />\
                              <label for="lname">Patient Last Name</label>\
                              <input type="text" id="lname" name="lname" />\
                              <label for="acc">Accession Number</label>\
                              <input type="text" id="acc" name="acc" />\
                              <label for="history">History</label>\
                              <textarea id="history" name="history" rows="2"></textarea>\
                              <label for="findings">Case Findings</label>\
                              <textarea id="findings" name="findings" rows="2"></textarea>\
                              <label for="discussion">Case Discussion</label>\
                              <textarea id="discussion" name="discussion" rows="2"></textarea>\
                              <label for="needs_follow_up">Needs Follow-up?</label>\
                              <input type="text" id="needs_follow_up" name="needs_follow_up" />\
                              <label for="quiz_title">Quiz Title</label>\
                              <input type="text" id="quiz_title" name="quiz_title" />\
                              <button id="submit_button" class="btn btn-success">Submit</button> \
                              <button type="reset" id="reset_button" class="btn btn-success">Reset</button> \
                          </form>';
        var template = _.template( texttemplate );
        this.$el.html( template );
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
            needs_follow_up: $("#needs_follow_up").val(),
            quiz_title: $("#quiz_title").val(),
        });
    },
    submit_case: function(event){
        event.preventDefault();
        this.model.case_create();
    },
    reset_case: function(event) {
        this.model.clear();
    }
});

CaseReadView = Backbone.View.extend({
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<div"> \
                              <h3>Case Title</h3>\
                              <h4 id="title"><%= title %></h4>\
                              <h3>Medical Record Number</h3>\
                              <h4 id="mrn"><%= mrn %></h4>\
                              <h3>Patient Last Name</h3>\
                              <h4 id="lname"><%= lname %></h4>\
                              <h3>Accession Number</h3>\
                              <h4 id="acc"><%= acc %></h4>\
                              <h3>History</h3>\
                              <h4 id="history"><%= history %></h4>\
                              <h3>Case Findings</h3>\
                              <h4 id="findings"><%= findings %></h4>\
                              <h3>Case Discussion</h3>\
                              <h4 id="discussion"><%= discussion %></h4>\
                              <h3>Needs Follow Up?</h3>\
                              <h4 id="needs_follow_up"><%= needs_follow_up %></h4>\
                              <h3>Quiz Title</h3>\
                              <h4 id="quiz_title"><%= quiz_title %></h4>\
                              <button type="submit" id="edit_button" class="btn btn-success">Edit this case</button> \
                          </div> \
                          <div> \
                            <h6>Image upload area.</h3> \
                            <input id="fileupload" type="file" name="files" data-url="/j/upload_file_to/<%= id %>" multiple>   \
                          </div>';
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
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
    initialize: function(){
        this.render();
        this.model.on("change",this.render,this);
    },
    render: function(){
        var texttemplate='<form id="case_entry"> \
                            <div class="form-group"> \
                              <label for="title">Case Title</label>\
                              <textarea id="title" name="title" rows="2" autofocus><%= title %></textarea>\
                              <label for="mrn">Medical Record Number</label>\
                              <input type="text" id="mrn" name="mrn" value="<%= mrn %>" />\
                              <label for="lname">Patient Last Name</label>\
                              <input type="text" id="lname" name="lname" value="<%= lname %>" />\
                              <label for="acc">Accession Number</label>\
                              <input type="text" id="acc" name="acc" value="<%= acc %>" />\
                              <label for="history">History</label>\
                              <textarea id="history" name="history" rows="2"><%= history %></textarea>\
                              <label for="findings">Case Findings</label>\
                              <textarea id="findings" name="findings" rows="2"><%= findings %></textarea>\
                              <label for="discussion">Case Discussion</label>\
                              <textarea id="discussion" name="discussion" rows="2"><%= discussion %></textarea>\
                              <label for="needs_follow_up">Needs Follow-up?</label>\
                              <input type="text" id="needs_follow_up" name="needs_follow_up" value="<%= needs_follow_up %>" />\
                              <label for="quiz_title">Quiz Title</label>\
                              <input type="text" id="quiz_title" name="quiz_title" value="<%= quiz_title %>" />\
                              <button type="submit" id="submit_button" class="btn btn-success">Submit</button> \
                              <button type="reset" id="reset_button" class="btn btn-success">Reset</button> \
                          </form>';
        
        var template = _.template( texttemplate, this.model.attributes );
        this.$el.html( template );
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
            needs_follow_up: $("#needs_follow_up").val(),
            quiz_title: $("#quiz_title").val(),
        });
    },
    submit_case: function(event){
        if (this.model.case_update()) {
            app.navigate('caseread/'+(this.model.get('id')), {trigger: true});
        };
    },
    reset_case: function(event) {
        this.model.set({});
    }
});