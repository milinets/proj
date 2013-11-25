appTemplates.casecreateview = hereDoc(function(){/*

<style type="text/css">
  input[type=checkbox] {
    display: none;
  }
  input:checked + label div {
    width: 50px;
    height: 50px;
    background-image: url('static/images/checkbox.png');
    background-size: 100%;
  }
  input:not(:checked) + label div {
    width: 50px;
    height: 50px;
    background-image: url('static/images/checkbox_empty.png');
    background-size: 100%;
  }
</style>


<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      Case Entry Form
    </h3>
  </div>
  <div class="panel-body">
  <form id="case_entry" class="form-horizontal"> 
      <div class="form-group">
        <div class="col-sm-4">
          <label for="title" class="control-label">Case Title</label>
          <textarea class="form-control" id="title" rows="2" autofocus></textarea>
        </div>
        <div class="col-sm-2">
          <label for="mrn" class="control-label">Medical Record #</label>
          <input type="text" class="form-control" id="mrn" />
        </div>
        <div class="col-sm-2">
          <label for="acc" class="control-label">Accession #</label>
          <input type="text" class="form-control" id="acc" />
        </div>
        <div class="col-sm-4">
          <label for="lname" class="control-label">Last Name</label>
          <input type="text" class="form-control" id="lname" />
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <label for="history" class="control-label">History</label>
          <textarea class="form-control" id="history" rows="2"></textarea>
        </div>
        <div class="col-sm-4">
          <label for="diagnosis" class="control-label">Diagnosis</label>
          <textarea class="form-control" id="diagnosis" rows="2"></textarea>
        </div>
        <div class="col-sm-4">
          <label for="quiz_title" class="control-label">Quiz Title</label>
          <textarea class="form-control" id="quiz_title" rows="2"></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-4">
          <input type="checkbox" id="needs_follow_up" checked="checked" />
          <label for="needs_follow_up" class="control-label">Needs Follow-up?<div></div></label>          
        </div>
        <div class="col-sm-4">
        </div>
        <div class="col-sm-4">
          <button id="submit_button" class="btn btn-success">Submit</button>
          <button type="reset" id="reset_button" class="btn btn-success">Reset</button>
        </div>
    </div>
  </form>
</div>          
*/});

CaseModel = Backbone.Model.extend({
    defaults: {
        title: '',        
        lname: '',
        mrn: '',
        acc: '',
        findings: '',
        history: '',
        diagnosis: '',
        needs_follow_up: '',
        quiz_title: '',
        datadump: '',
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
        this.$el.html( this.template(this.model) );
        return this;
    },
    events: {
        "click #submit_button": "submit_case",
        "click #reset_button": "reset_case"
    },
    submit_case: function(event){
        var that = this;
        event.preventDefault();
        var inputs = this.$el.find('.form-control');
        _.each(inputs, function(inpt) { that.model.set(inpt.id,inpt.value) });
        that.model.set('needs_follow_up',$('#needs_follow_up').prop('checked'));
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