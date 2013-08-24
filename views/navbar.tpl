<!-- requires: session -->

<div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container-fluid">
      <a class="brand" href="/">UCLA Neuroradiology<br> Teaching File</a>
      <ul class="nav">
        %if session.get('navbar'): 
          %for name, addr in session.get('navbar'):
            <li>
              <a href="{{addr}}">{{name}}</a>
            </li>
          %end
        %else:
          <!-- include links to case of month, etc -->
        %end
        %if session.get('username'):
          <li>
            <img src="/usr_img/francis">
          </li>
          <li>
            <a href="/logout">{{session.get('username')}}</a>
          </li>
          <li>
            <a href="/logout">Log Out</a>
          </li>
        %else:
          <li >
          <form class="navbar-form form-inline pull-right" method="post" action="/login">
            <input name="username" id="username" type="text" value="{{get('lastuser','')}}" autofocus class="input-small" placeholder="Username" />
            <input name="password" id="password" type="password" value="" class="input-small" placeholder="Password" />
            <button type="submit" class="btn">Sign In</button>
          </form>
          </li>
        %end
      </ul> <!-- nav -->
    </div> <!-- container-fluid -->
  </div> <!-- navbar-inner -->
</div> <!-- navbar -->