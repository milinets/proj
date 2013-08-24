<h2>Register a new user</h2>



  <form <form method="post" action="/register">
  <div class="grid_4 push_1">
      <label for="username">Username: </label> 
      <input name="username" type="text" value="{{form.username}}" autofocus />
      <label for="password">Password: </label> 
      <input name="password" type="password" value="" />
      <label for="confirm">Confirm Password: </label> 
      <input name="confirm" type="password" value="" />
  </div>
  <div class="grid_4 push_2">
      <label for="email">Email address: </label> 
      <input name="email" type="text" value="{{form.email}}" />
      <label for="first_name">First Name: </label> 
      <input name="first_name" type="text" value="{{form.first_name}}" />
      <label for="last_name">Last Name: </label> 
      <input name="last_name" type="text" value="{{form.last_name}}" />
    </div>
  <div class="clear"></div>
  <div class="grid_3 push_4">
    <input type="submit" value="Register">
  </div>
  </form>

%rebase base title="Register User", form=form, session=session, message=message