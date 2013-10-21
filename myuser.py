import psycopg2
import psycopg2.extras
import uuid
import json

pg_conn_string = """
                    dbname='action' 
                    user='action'
"""

pg_conn_string = """
                    dbname='me' 
                    user='me'
"""


def connect_db():
    return psycopg2.connect(pg_conn_string)

class User(object):
    def getbyemail(email):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT id, data from db WHERE data::text LIKE %s",('%'+email+'%',))
        myid, mydict = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        mydict['id'] = myid
        return mydict

    def login(email):
        session = request.environ.get('beaker.session')
        session['email'] = email
        
    @property
    def loggedIn(self):
        session = request.environ.get('beaker.session')
        if 'email' in session:
            return True
        else:
            return False
    
    @property
    def current_user(self):
        session = request.environ.get('beaker.session')
        if 'email' in session:  
            return self.getbyemail(session.get('email'))
        else:
            raise AuthException('Unauthenticated user")
