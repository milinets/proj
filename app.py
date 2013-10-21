# bottle 0.10.11
from bottle import Bottle, route, run, abort, request, response, template, debug, static_file, redirect, ServerAdapter, server_names
from beaker.middleware import SessionMiddleware
import requests
import os
import sys
import shutil
import re
import random
import hashlib
import hmac
from string import letters
import json
from collections import namedtuple
import dbfuncs
from userclass import User
from caseclass import TFCase

site = Bottle()
session_opts = {
	'session.type' : 'file',
	'session.timeout' : 900,
	'session.cookie_expires' : True,
	'session.data_dir' : './data',
	'session.auto' : True
}

app = SessionMiddleware(site, session_opts)
thisuser = User()
tfcase = TFCase()

###### Static Routes

@site.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')

@site.route('/cases/<case_id>/<filename>')
def server_case_image(case_id,filename):
	return static_file(filename, root="./cases/"+case_id)

@site.get('/')
def index():
    return static_file('index.html',root=".")
  
@site.get('/favicon.ico')
def icon():
    return static_file('box.png',root="./static/img")

###### JSON login routes

### if logged in return {username : username, loggedIn: True}

@site.post('/auth/login')
def login():
    # The request has to have an assertion for us to verify
    if 'assertion' not in request.forms:
        abort(400)

    # Send the assertion to Mozilla's verifier service.
    data = {'assertion': request.forms.get('assertion'), 'audience': request.url}
    resp = requests.post('https://verifier.login.persona.org/verify', data=data, verify=False)

    # Did the verifier respond?
    if resp.ok:
        # Parse the response
        verification_data = json.loads(resp.content)

        # Check if the assertion was valid
        if verification_data['status'] == 'okay':
            thisuser.login(verification_data['email'])
            print 'You are logged in'
            return {'email': verification_data['email'], 'loggedIn': True}

    # Oops, something failed. Abort.
    abort(500)

@site.post('/auth/logout')
def logout():
    session = request.environ.get('beaker.session')
    if session:
        session.delete()
    return {'email': None, 'loggedIn': False}

@site.post('/auth/check')
def checklogin():
    session = request.environ.get('beaker.session')
    if 'email' in session:
        return {'email': session.get('email'), 'loggedIn': True}
    else:
        return {'email': '', 'loggedIn': False}

###### Search the database and return collection of cases         
@site.post('/j/search')
def jpostsearch():
    if thisuser.loggedIn:
        try:
            searchterm = request.POST.get('searchterm')
            response.content_type = 'application/json'
            return json.dumps(tfcase.search(searchterm))
        except:
            print "error: ", sys.exc_info()        
    else:
        return {'error':'Please log in first.'}
        
@site.get('/j/searchall')
def jgetallcases():
    if thisuser.loggedIn:
        try:
            response.content_type = 'application/json'
            return json.dumps(tfcase.list_all_cases())
        except:
            print "error: ", sys.exc_info()
    else:
        return {'error':'Please log in first.'}
              
###### Case paths

### create a new case
@site.post('/j/case')
def jpostcase():
    if not thisuser.loggedIn:
        abort(401, 'You are not logged in.')
    try:
        return tfcase.create(request.json)
    except:
        print "error: ", sys.exc_info()
        abort(405, sys.exc_info())

### get case from database, or refresh
@site.get('/j/case/<caseid>')
def jgetcase(caseid):
    if not thisuser.loggedIn:
        abort(401,'You are not logged in.')
    try:
        return tfcase.read(caseid)
    except:
        print "error: ", sys.exc_info()        
        abort(401, 'Could not find this case.')

### update existing case
@site.put('/j/case/<caseid>')
def jputcase(caseid):
    if not thisuser.loggedIn:
        abort(401, 'You are not logged in.')
    try:
        data = request.json
        del data['id']
        return tfcase.update(caseid,data)
    except:
        abort(401, sys.exc_info())

### delete a case
@site.delete('/j/case/<caseid>')
def jdeletecase(caseid):
    if not thisuser.loggedIn:
        return {'error': 'You are not logged in.'}
    try:
        return tfcase.delete(caseid)
    except:
        abort(401, 'Could not find this case.')
        
@site.post('/j/upload_file_to/<caseid>')
def do_upload(caseid):
    if not thisuser.loggedIn:
        return {'error': 'You are not logged in.'}
	resp_array = []
	for i in request.files.getlist('files'):
        # create a type: image entry in db and extract its id
        # filename = id + '.' + i.filename.split('.')[-1]
        # filepath = os.path.join('./static/caseimages',filename)
		fileobj = i.file
		with open(filepath,"wb") as target_file:
			while True:
				datachunk = fileobj.read(1024)
				if not datachunk:
					break
				target_file.write(datachunk)
		resp_array.append({'name':filename,'url': './static/caseimages/'+ filename, \
			"delete_url":'/delete_image/'+case_id+'/'+filename, "delete_type":"DELETE"})
	return json.dumps(resp_array)        

        

@site.get('/register')
def signup_form():
	session = request.environ.get('beaker.session')
	return template('signup-form', form=forms.RegistrationForm(), message=[], session=session)

@site.post('/register')
def do_signup():
	form = forms.RegistrationForm(request.forms)
	session = request.environ.get('beaker.session')
	if session.get('username') != 'ml':
		return template('signup-form', form=form, message=["Please log in first"], session=session)
	if not form.validate():
		return template('signup-form', form=form, message=[form.message], session=session)
	user = models.User()
	if user.read(form.username):
		return template('signup-fhttp://localhost/loginorm', form=form, message = ["User %s is already registered" % form.username], session=session)
	user = models.User(form.__dict__)
	user.create()
	return template('signup-form', form=forms.RegistrationForm(), message = ["User %s successfully registered" % user.username, "Register another?"], session=session)

@site.get('/user/<username>')
def show_user_profile(username):
	session = request.environ.get('beaker.session')
	if 'username' in session:
		if username == session['username'] or session['username'] == 'ml':
			thisUser = models.User().read(username)
			return template('show-user', user=thisUser)
		else:
			return template('home', message=["You can only view/edit your own account information."], session=session)
	else:
		return template('home', message=["Please log in."], session=session)

@site.post('/user/<username>')
def update_user(username):
	session = request.environ('beaker.session')
	if 'username' not in session:
		return template('home', message="Please log in.")
	form = forms.RegistrationForm(request.forms)
	if not form.validate():
		return template('signup-form', form=form, message = "Invalid form data.")
	thisUser = User(form.username)
	if thisUser.username != username:
		return template('signup-form', message="You can only view your own account information.")
	thisUser.update(form)
	return template('show-user', message="User %s updated" % thisUser.username)

def do_upload(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		return template(home, message=["Please log in to update case"], session=session)
	resp_array = []
	for i in request.files.getlist('files'):
		if not os.path.exists(os.path.join('./cases',case_id)):
			os.makedirs(os.path.join('./cases',case_id))
		filename = models.get_id() + '.' + i.filename.split('.')[-1]
		filepath = os.path.join('./cases',case_id,filename)
		fileobj = i.file
		with open(filepath,"wb") as target_file:
			while True:
				datachunk = fileobj.read(1024)
				if not datachunk:
					break
				target_file.write(datachunk)
		resp_array.append({'name':filename,'url': '/cases/'+ case_id + '/' + filename, \
			"delete_url":'/delete_image/'+case_id+'/'+filename, "delete_type":"DELETE"})
	return json.dumps(resp_array)


@site.get('/newcase')
def newcase_form():
	session = request.environ.get('beaker.session')
	if 'username' in session:
		return template('enterCase', form=forms.TFForm(), session=session, message=[])
	else:
		return template('enterCase', message=["Please log in first."], form=forms.TFForm(), session=session)

@site.post('/newcase')
def do_newcase():
	session = request.environ.get('beaker.session')
	form = forms.TFForm(request.forms)
	if 'username' not in session:
		return template('enterCase', form=form, message=["Please log in first."],session=session)
	if not form.validate():
		return template('enterCase', form=form, message=[form.message],session=session)
	thisCase = models.Case(form.__dict__)
	#if thisCase.exists():
	#	return render_template('enterCase',form=form,message="A case with this MRN already exists",session=session)
	thisCase.create()
	redirect('/showcase/%s' % thisCase.case_id)

@site.get('/editcase/<case_id>')
def editcase_form(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		session['crumb'] = '/editcase/%s' % case_id
		return template('home', message="Please log in first.")
	thisCase = models.Case()
	if thisCase.read(case_id):
		form = forms.TFForm(thisCase.__dict__)
		return template('editCase',form=form,session=session,message=[],case=thisCase)
	else:
		return template('home',message=["Case does not exist."],session=session)

@site.post('/editcase/<case_id>')
def do_editcase(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		session['crumb'] = '/editcase/%s' % case_id
		return template('home', message="Please log in first.")
	form = forms.TFForm(request.forms)
	if not form.validate():
		return template('editCase',form=form,message=["Invalid form data."],session=session)
	thisCase = models.Case()
	form.needs_follow_up = (form.needs_follow_up == "True")
	if thisCase.read(case_id):
		thisCase.__dict__.update(form.__dict__)
		thisCase.update()
		redirect('/showcase/%s' % thisCase.case_id)
	else:
		return template('home',message=["Case does not exist."],session=session)

@site.get('/showcase/<case_id>')
def showcase(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		session["crumb"] = '/showcase/%s' % case_id
		return template('home', message=["Please log in first"], session=session)
	thisCase = models.Case()
	if thisCase.read(case_id):
		return template('showCase',case=thisCase,session=session,message=[])
	else:
		return template('home',message=["Case does not exist."],session=session)

@site.post('/upload_file_to/<case_id>')
def do_upload(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		return template(home, message=["Please log in to update case"], session=session)
	resp_array = []
	for i in request.files.getlist('files'):
		if not os.path.exists(os.path.join('./cases',case_id)):
			os.makedirs(os.path.join('./cases',case_id))
		filename = models.get_id() + '.' + i.filename.split('.')[-1]
		filepath = os.path.join('./cases',case_id,filename)
		fileobj = i.file
		with open(filepath,"wb") as target_file:
			while True:
				datachunk = fileobj.read(1024)
				if not datachunk:
					break
				target_file.write(datachunk)
		resp_array.append({'name':filename,'url': '/cases/'+ case_id + '/' + filename, \
			"delete_url":'/delete_image/'+case_id+'/'+filename, "delete_type":"DELETE"})
	return json.dumps(resp_array)

@site.get('/get_images/<case_id>')
def get_images(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		return template(home, message=["Please log in to update case"], session=session)
	resp_array = []
	for img_file in os.listdir(os.path.join('./cases',case_id)):
		if not os.path.isdir(os.path.join('./cases',case_id,img_file)) and (img_file[0] != '.'):
			resp_array.append('/cases/'+case_id+'/'+img_file)
	return json.dumps(resp_array)

@site.get('/delete_image/<case_id>/<img_file>')
def delete_image(case_id,img_file):
	session = request.environ['beaker.session']
	if 'username' not in session:
		pass
	try:
		os.makedirs(os.path.join('./cases',case_id,'deleted'))
	finally:
		shutil.move('./cases/'+case_id+'/'+img_file,'./cases/'+case_id+'/deleted/'+img_file)
		redirect('/showcase/'+case_id)

@site.get('/searchcase')
def showsearch():
	session = request.environ.get('beaker.session')
	if 'username' in session:
		return template('searchCase', session=session, message=[])
	else:
		return template('searchCase', message=["Please log in first."], session=session)

@site.post('/searchcase')
def showsearchresults():
	session = request.environ['beaker.session']
	if 'username' not in session:
		session['crumb'] = '/search'
		return template('home', message=["Please log in first."])
	form = request.forms
	if form.get("search_mrn"):
		query = "SELECT * from cases WHERE mrn LIKE %s"
		arg = '%' + form['search_mrn'] + '%'
	elif request.forms.get("search_case_title"):
		query = "SELECT * from cases WHERE case_title LIKE %s"
		arg = '%' + form['search_case_title'] + '%'
	elif request.forms.get("search_all_text"):
		query = "SELECT * from cases WHERE findings LIKE %s"
		arg = '%' + form['search_all_text'] + '%'
	else:
		return template('searchCase',session=session,message=["No search entered."])
	cases = [models.Case(a) for a in models.get_all_rows(query,(arg,))]
	if not cases:
		return template('searchCase',session=session,message=["No matching case was found."])
	else:
		return template('listSearch',session=session, cases=cases, message=[])

@site.get('/deletecase/<case_id>')
def delete_case_show(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		return template('home', message="Please log in first.")
	thisCase = TFCase(case_id)
	return template('deletecase', case=thisCase, message="Really delete this case?")

@site.post('/deletecase/<case_id>')
def delete_case(case_id):
	session = request.environ['beaker.session']
	if 'username' not in session:
		return template('home', message="Please log in first.")
	thisCase = TFCase(case_id)
	thisCase.delete()

@site.get('/procedurelog')
def procedurelog():
    pass

@site.get('/procedure_manual')
def procedure_manual():
    pass

@site.get('/caseofmonth')
def caseofmonth():
    pass

class SSLCherryPy(ServerAdapter):
	def run(self,handler):
		from cherrypy import wsgiserver
		server = wsgiserver.CherryPyWSGIServer((self.host,self.port),handler)
		# openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
		# technique here: http://dgtool.blogspot.com/2011/12/ssl-encryption-in-python-bottle.html
		cert = './server.pem'
		server.ssl_certificate = cert
		server.ssl_private_key = cert
		try:
			server.start()
		finally:
			server.stop()

server_names['sslcherrypy'] = SSLCherryPy

debug(True)
if __name__ == '__main__':
	# wwh
	# run(app=app, host='localhost', port=443, reloader=True, server='sslcherrypy')
	
	# localhost
	# run(app=app, host='0.0.0.0', port=3000, reloader=True, server='sslcherrypy')

    # localhost without ssl
    run(app=app, host='0.0.0.0', port=3000, reloader=True)