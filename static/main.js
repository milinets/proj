// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.

require.config({
  paths: {
      jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js',
      underscore: '/static/lib/js/underscore-min.js',
      backbone: '/static/lib/js/backbone-min.js'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});