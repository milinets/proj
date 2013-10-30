import datetime
import uuid
import bottle
import psycopg2
import psycopg2.extras
import json
from dbfuncs import connect_db, pg_conn_string

#
#TFimage: id: , type: 'tfimage', extension: , caption: , tfcase: (id), date-created:
#
#
class TFimage():
    def __init__(self):
        self.data = {}
    
    def create(self):
        datastring = json.dumps(self.data)
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO db (id,data) VALUES (%s,%s)", (self.data['id'],datastring))
        conn.commit()
        cur.close()
        conn.close()
        return self.data
    
    def read(self,imageid):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from db WHERE id = %s",(imageid,))
        data = cur.fetchone()[0]
        conn.commit()
        cur.close()
        return data

    def searchimagesbytfcase(self,caseid):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT id, data from db WHERE data::text LIKE %s",('%'+caseid+'%',))
        data = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for pair in data:
            id, mydict = pair
            try:
                mydict['id'] = id
                if not mydict.get('deleted'):
                    mylist.append(mydict)
            except:
                print mydict + " Doesn't work"
        return sorted(mylist, key=lambda case: case['date-created'], reverse=True)
        
    
        
#
# TFimage-stack: id: , type: 'tfimage-stack', images: [id], tfcase: (id), date-created: 
#
#
class TFimagestack():
    def __init__(self):
        pass