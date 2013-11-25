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
    # finds user object in database and returns it
    # no change to self    
    def getbyemail(self,email):
        try:
            conn=connect_db()
            cur = conn.cursor()
            cur.execute("SELECT data from dba WHERE data->>'type' = 'tfuser' and data->>'email' = %s",(email,))
            mydata = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            self.data = mydata
            return mydata
        except:
            return False

    # finds user object in database and returns it
    # no change to self
    def getbyid(self,user_id):
        try:
            conn=connect_db()
            cur = conn.cursor()
            cur.execute("SELECT data from dba WHERE data->>'type' = 'tfuser' and data->>'id' = %s",(user_id,))
            mydata = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            self.data = mydata
            return mydata
        except:
            return False

    def create_user_in_db(self,email):
        user_id = str(uuid.uuid4())
        picture = str(uuid.uuid4())
        data = {'type' : 'tfuser', 'email': email, 'picture': picture, 'id' : user_id, 'first_name': '', 'last_name': ''}
        datastring = json.dumps(data)
        try:
            conn=connect_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO dba VALUES (%s)",(datastring,))
            conn.commit()
            cur.close()
            conn.close()
            self.data = data
            return data
        except:
            return False

    def delete_user_from_db(self):
        try:
            conn=connect_db()
            cur = conn.cursor()
            cur.execute("DELETE FROM dba WHERE data->>'id' = %s;",(self.data['id'],))
            conn.commit()
            cur.close()
            conn.close()
            return True
        except:
            return False

    def update(self, user):
        conn=connect_db()
        cur = conn.cursor()
        user_id = user['id']
        datastring = json.dumps(user)
        cur.execute("UPDATE dba SET data = %s WHERE data->>'id' = %s",(datastring,user_id))
        conn.commit()
        cur.close()
        conn.close()
        self.data = user
        return user
    
    def login(self,email,session):
        possible_user = self.getbyemail(email)
        if possible_user:
            self.data = possible_user
            self.data['loggedIn'] = True
            self.update(self.data)
            session['user_id'] = self.data['id']
            return True
        else:
            return False

    def logout(self):
        try:
            self.data['loggedIn'] = False
            self.update(self.data)
            self.data = {}
            return True
        except: 
            return False
    
    def loggedIn(self):
        return 'user_id' in bottle.request.environ.get('beaker.session')