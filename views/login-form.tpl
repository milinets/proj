<!doctype html>
<head>
  <meta charset="utf-8">

  <title>{{get('title','Not yet rendered')}}</title>
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" type="text/css" href="/css/reset.css">
  <link rel="stylesheet" type="text/css" href="/css/text.css">
</head>

<body>
    <div id="header">
      <img src="http://i.imgur.com/FibCN.png" width=960px >
    </div>

    <div id="login" style="border:1px solid gray">
        <form method="post" action="/login">
          <label for="username">Username: </label> 
          <input name="username" type="text" value="{{get('form.username()','')}}" />
          <label for="password">Password: </label> 
          <input name="password" type="password" value="" />
          <input type="submit" value="Log me in">
        </form>
        <a href="/register"> Register for an account. </a>
    </div>

    <div id="navbar" style="border:1px solid red">
        <a href= "/main.html">Overview</a>
        <a href= "/faculty.html">Faculty</a>
        <a href= "/facilities.html">Facilities</a>
        <a href= "/curriculum.html">Curriculum</a>
        <a href= "/research.html">Research</a>
        <a href= "/howtoapply.html">How To Apply</a>
        <a href= "/contact.html">Contact Us</a>
    </div>

    <div id="message" style="border:1px solid green">
      %if get('message',None):
        %for i in message: 
          <p>{{i}}</p>
        %end
      %end
    </div>

    <div id="main">

    </div>

  </script>

</body>
</html>