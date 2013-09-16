
// Filename: views/loginview

define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!/static/templates/search.html'
], function($, _, Backbone, searchTemplate){
  var SearchView = Backbone.View.extend({
    el: $('#searchbox'),
    render: function(){
      var template = _.template( searchTemplate, this.model.attributes );
      this.$el.html( template );
    },
    events: {
        "click #search_button": "doSearch"
    },
    doSearch: function( event ){
        event.preventDefault();
        var input = $('#search_input').val();
        console.log('Search input is ' + input);
    }
  });
  // Our module now returns our view
  return SearchView;
});
