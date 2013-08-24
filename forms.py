class RegistrationForm(object):
    def __init__(self,form={}):
        for k in ('username','password','first_name','last_name','email'):
            setattr(self,k,'')
        for k,v in form.items():
            setattr(self, k, v)

    def validate(self):
        if (not self.username):
            self.message = "Username required."
            return False
        elif (not self.password):
            self.message = "Password required."
            return False
        elif self.confirm != self.password:
            self.message = "Passwords must match."
            return False
        elif len(self.username) < 2:
            self.message = "Username must be greater than 2 characters long."
        else:
            return True

class LoginForm(object):
    def __init__(self,form={}):
        for k, v in form.items():
            setattr(self, k, v)

    def validate(self):
        if self.username and (len(self.username)>=2) and self.password:
            return True

case_columns = ('case_title','mrn','lname','acc','history', \
                'findings','discussion','ddx','quiz_title','keywords', \
                'needs_follow_up', 'permissions','message')

class TFForm(object):
    def __init__(self,form={}):
        for k in case_columns:
            setattr(self,k,'')
        setattr(self,'needs_follow_up',True)
        for k,v in form.items():
            setattr(self, k, v)

    def validate(self):
        if (not self.case_title):
            self.message = "Case title is required"
            return False
        elif (not self.mrn):
            self.message = "A Medical Record Number is required"
            return False
        else:
            return True

class SearchForm(object):
    def __init__(self,form):
        for k,v in form.items():
            setattr(self, k, v)




"""    


class SearchForm(Form):
    text_search = TextField('Full Text Search')
    mrn_search = TextField('Medical Record Number')
    lname_search = TextField('Patient Last Name')


"""

