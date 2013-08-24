<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{get('title','No title yet')}}</title>
  <!-- Bootstrap -->
  <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
</head>
<body>

  <div class="row">
    <div class="span6">
      UCLA Neuroradiology Teaching File
    </div>
    <div class="span6">
      %if session.get('username'):
        <img src="/usr_img/francis"> {{session.get('username')}} • 
        <a href="/logout">Log Out</a>
      </p>
      %else:
      <form method="post" action="/login">
        <label for="username">Username: </label> 
        <input name="username" type="text" value="{{get('lastuser','')}}" autofocus />
        <label for="password">Password: </label> 
        <input name="password" type="password" value="" />
        <input type="submit" value="Log me in">
      </form>
      %end
  </div>
  </div>

  <div class="row">
    <div class="span12">
      %if session.get('navbar'): 
        %for name, addr in session.get('navbar'):
          <a href="{{addr}}">{{name}}</a>
        %end
      %else:
        <a href= "/main.html">Overview</a>
        <a href= "/faculty.html">Faculty</a>
        <a href= "/facilities.html">Facilities</a>
        <a href= "/curriculum.html">Curriculum</a>
        <a href= "/research.html">Research</a>
        <a href= "/howtoapply.html">How To Apply</a>
        <a href= "/contact.html">Contact Us</a>
      %end
    </div>
  </div>

  %if get('message',None):
    <div class="row">
      <div class="span12">
        %for i in message: 
          <p>{{i}}</p>
        %end
      </div>
    </div>
  %end

  <div class="container">
    %include
  </div>


  <script src="http://code.jquery.com/jquery-latest.js"></script>
  <script src="js/bootstrap.min.js"></script>
</body>
</html>

