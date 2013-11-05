import bottle
import psycopg2
import psycopg2.extras
import uuid
import json
from dbfuncs import connect_db, pg_conn_string

#
# TFuser: type: 'tfuser', email: , id: , first_name: , last_name: , role: , picture: , cases-created: [], cases-viewed: []
#           role: 
#

class TFuser(object):
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

    def getbyid(self,user_id):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from db WHERE id = %s",(user_id,))
        mydata = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        mydata['id'] = user_id
        return mydata

    def create_user(self,email):
        user_id = str(uuid.uuid4())
        picture = str(uuid.uuid4())
        data = {'type' : 'tfuser', 'email': email, 'picture': picture}
        if email.split('@')[-1] == 'mednet.ucla.edu' or email == 'moe@mailinator.com':
            pass
        else:
            data['role'] = 'provisional'
        datastring = json.dumps(data)
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO db (id,data) VALUES (%s,%s)", (user_id,datastring))
        conn.commit()
        cur.close()
        conn.close()
        data['id'] = user_id
        return data

    def update(self, user):
        conn=connect_db()
        cur = conn.cursor()
        user_id = user['id']
        del user['id']
        datastring = json.dumps(user)
        cur.execute("UPDATE db SET data = %s WHERE id = %s",(datastring,user_id))
        conn.commit()
        cur.close()
        conn.close()
        mydata.setdefault('picture',str(uuid.uuid4()))
        user['id'] = user_id
        return user
    
    def login(self,email,session):
        try: 
            user = self.getbyemail(email)
            session['user_id'] = user['id']
            return True
        except:
            session['user_id'] = (self.create_user(email))['id']
            return True
    
    def loggedIn(self):
        return 'user_id' in bottle.request.environ.get('beaker.session')