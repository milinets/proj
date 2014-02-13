# bottle 0.10.11
from bottle import Bottle, route, run, abort, request, response, template, debug, static_file, redirect, ServerAdapter, server_names
from beaker.middleware import SessionMiddleware
import requests
import os
import subprocess
import platform
import socket
import sys
import shutil
import re
import uuid
import datetime
import random
import hashlib
import hmac
from string import letters
import json
from collections import namedtuple
import dbfuncs
from userclass import TFuser
from caseclass import TFcase
from imageclass import TFimage, TFimagestack


site = Bottle()
session_opts = {
	'session.type' : 'cookie',
    'session.validate_key' : 'validkey',
	'session.timeout' : 900,
	'session.cookie_expires' : True,
	'session.data_dir' : './data',
	'session.auto' : True
}

app = SessionMiddleware(site, session_opts)
thisuser = TFuser()
tfcase = TFcase()

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
            session = request.environ.get('beaker.session')
            if thisuser.login(verification_data['email'], session):
                return thisuser.data

    # Oops, something failed. Abort.
    abort(500)

@site.post('/auth/logout')
def logout():
    session = request.environ.get('beaker.session')
    thisuser.logout()
    if session:
        session.delete()
    return {'email': None, 'loggedIn': False}

@site.post('/auth/check')
def checklogin():
    session = request.environ.get('beaker.session')
    if 'user_id' in session:
        return thisuser.data
    else:
        return {'email': '', 'loggedIn': False}

@site.get('/j/user')
def get_user():
    if 'user_id' in request.environ.get('beaker.session'):
	try:
		return {'user' : thisuser.data }
	except:
		return {'error' : "Couldn't get userid."}

@site.put('/j/user/<user_id>')
def update_user(user_id):
	new_user_info = request.json
	session = request.environ.get('beaker.session') 
	logged_user = thisuser.getbyid(session['user_id'])
	if new_user_info['id'] == logged_user['id']:
		logged_user.update(new_user_info)
		return thisuser.update(logged_user)

@site.post('/j/upload_userpic/<picture>')
def upload_userpic(picture):
    session = request.environ.get('beaker.session')
    if 'user_id' not in session:
        return {'error': 'You are not logged in.'}
    if not (picture == thisuser.data.get('picture')):
        return {'error': 'Wrong user logged in'}
    for i in request.files.getlist('file'):
        filepath = os.path.join('./static/userimages',thisuser.data.get('picture'))
        fileobj = i.file
        with open(filepath,"wb") as target_file:
            while True:
                datachunk = fileobj.read(1024)
                if not datachunk:
                    break
                target_file.write(datachunk)
    return "ok"

@site.get('/j/userpic/<picture>')
def send_userpic(picture):
    response.content_type = "image/jpeg"
    return static_file(picture, root="./static/userimages/")

###### Search the database and return collection of cases         
@site.post('/j/search')
def jpostsearch():
    if thisuser.loggedIn:
        try:
            searchterm = request.POST.get('searchterm')
            images_only = request.POST.get('images_only')
            response.content_type = 'application/json'
            return json.dumps(tfcase.search(searchterm,images_only))
        except:
            print "error: ", sys.exc_info()        
    else:
        return {'error':'Please log in first.'}
        
@site.post('/j/searchall')
def jgetallcases():
    if 'user_id' in request.environ.get('beaker.session'):
        try:
            response.content_type = 'application/json'
            return json.dumps(tfcase.list_all_cases())
        except:
            print "error: ", sys.exc_info()
    else:
        return {'error':'Please log in first.'}
              
@site.post('/j/searchallwithimages')
def jgetallcases():
    if 'user_id' in request.environ.get('beaker.session'):
        try:
            response.content_type = 'application/json'
            return json.dumps(tfcase.list_all_cases_with_images())
        except:
            print "error: ", sys.exc_info()
    else:
        return {'error':'Please log in first.'}

###### Case paths

### create a new case
@site.post('/j/case')
def jpostcase():
    if not thisuser.loggedIn:
    	return {'error': 'You are not logged in.'}
    try:
        return tfcase.create(request.json)
    except:
    	return {'error': sys.exc_info()}

### get case from database, or refresh
@site.get('/j/case/<caseid>')
def jgetcase(caseid):
    if not thisuser.loggedIn:
    	return {'error': 'You are not logged in.'}
    try:
        return tfcase.read(caseid)
    except:
    	return {'error': sys.exc_info()}

### update existing case
@site.put('/j/case/<caseid>')
def jputcase(caseid):
    if not thisuser.loggedIn:
        return {'error':'You are not logged in.'}
    try:
        data = request.json
        return tfcase.update(data)
    except:
    	return {'error': sys.exc_info()}

### delete a case
@site.delete('/j/case/<caseid>')
def jdeletecase(caseid):
    if not thisuser.loggedIn:
        return {'error': 'You are not logged in.'}
    try:
        return tfcase.delete(caseid)
    except:
    	return {'error': 'Could not find this case.'}
        
@site.post('/j/upload_image_to/<caseid>')
def do_image_upload(caseid):
    if 'user_id' not in request.environ.get('beaker.session'):
        return {'error': 'You are not logged in.'}
    resp_array = []
    for i in request.files.getlist('file'):
        thisimage = TFimage()
        thisimage.data['id'] = str(uuid.uuid4())
        thisimage.data['type'] = 'tfimage'
        thisimage.data['tfcase'] = caseid
        thisimage.data['caption'] = ''
        thisimage.data['date-created'] = datetime.datetime.now().isoformat()
        filename = thisimage.data['filename'] = thisimage.data['id'] + '.' + i.filename.split('.')[-1]
        filepath = os.path.join('./static/caseimages',filename)
        fileobj = i.file
        with open(filepath,"wb") as target_file:
            while True:
                datachunk = fileobj.read(1024)
                if not datachunk:
                    break
                target_file.write(datachunk)
        thisimage.create()
        resp_array.append(thisimage.data)
    return "ok"

@site.get('/j/image/<imageid>')
def get_image(imageid):
    thisimage = TFimage()
    thisimage.read(imageid)
    return thisimage.data

@site.put('/j/image/<imageid>')
def update_image(imageid):
    thisimage = TFimage()
    thisimage.read(imageid)
    thisimage.data['caption'] = request.json['caption']
    thisimage.update()
    return thisimage.data

@site.delete('/j/image/<imageid>')
def delete_image(imageid):
    thisimage = TFimage()
    thisimage.read(imageid)
    thisimage.delete()
    return {"ok":True}

@site.get('/j/images/<caseid>')
def jgetimage(caseid):
    if 'user_id' not in request.environ.get('beaker.session'):
        return {'error': 'You are not logged in.'}
    try:
        thisimage = TFimage()
        response.content_type = 'application/json'
        return json.dumps(thisimage.searchimagesbytfcase(caseid))
    except:
        return {'error': repr(sys.exc_info())}

@site.post('/j/upload_image_stack_to/<caseid>')
def do_image_stack_upload(caseid):
    pass
        

@site.get('/procedurelog')
def procedurelog():
    pass

@site.get('/procedure_manual')
def procedure_manual():
    pass

@site.get('/caseofmonth')
def caseofmonth():
    pass

def https_redirect():
    if not request.get_header('X-Forwarded-Proto','http') == 'https':
        url = request.url.replace('http://','https://', 1)
        code = 301
    redirect(url, code)

class SSLCherryPy(ServerAdapter):
    def run(self,handler):
        from cherrypy import wsgiserver
        server = wsgiserver.CherryPyWSGIServer((self.host,self.port),handler)
		# openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
		# technique here: http://dgtool.blogspot.com/2011/12/ssl-encryption-in-python-bottle.html
        cert = './server.pem'
#        server.ssl_adapter = wsgiserver.SSLAdapter(cert,cert)
        server.ssl_certificate = cert
        server.ssl_private_key = cert
        try:
            server.start()
        finally:
            server.stop()

server_names['sslcherrypy'] = SSLCherryPy

debug(True)
if __name__ == '__main__':
    thishost = platform.uname()
    hostip = subprocess.check_output("hostname -I",shell=True).replace(' \n','')

    # wwh
    # run(app=app, host=hostip, port=443, reloader=True, server='sslcherrypy')

	# localhost
	# run(app=app, host='0.0.0.0', port=3000, reloader=True, server='sslcherrypy')

    # localhost without ssl
    # run(app=app, host=hostip, port=8000, reloader=True, server='paste')

    from paste import httpserver
    httpserver.serve(app, host='0.0.0.0', port=443, ssl_pem='./server.pem')