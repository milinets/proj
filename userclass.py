import bottle

class User(object):
    def getbyemail(self,email):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT id, data from db WHERE data::text LIKE %s",('%'+email+'%',))
        myid, mydata = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        mydata['id'] = myid
        return mydata
    
    def login(self,email):
        session = bottle.request.environ.get('beaker.session')
        session['email'] = email
        return True
    
    @property
    def loggedIn(self):
        return 'email' in bottle.request.environ.get('beaker.session')
    
    @property
    def current_user(self):
        session = bottle.request.environ.get('beaker.session')
        if 'email' in session:
            return self.getbyemail(session.get('email'))