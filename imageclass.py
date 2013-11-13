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
        cur.execute("INSERT INTO dba (data) VALUES (%s)", (datastring,))
        conn.commit()
        cur.close()
        conn.close()
        return self.data
    
    def read(self,imageid):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from dba WHERE data->>'id' = %s",(imageid,))
        data = cur.fetchone()[0]
        conn.commit()
        cur.close()
        self.data = data
        return data

    def update(self):
        datastring = json.dumps(self.data)
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("UPDATE dba SET data = %s WHERE data->>'id' = %s",(datastring,self.data.get('id')))
        conn.commit()
        cur.close()
        return True

    def delete(self):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM dba WHERE data->>'id' = %s",(self.data.get('id'),))
        conn.commit()
        cur.close()
        return True

    def searchimagesbytfcase(self,caseid):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from dba WHERE data->>'tfcase' = %s",(caseid,))
        data = cur.fetchall()
        if not data:
            return []
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for image in data:
            mylist.append(image[0])
        return sorted(mylist, key=lambda case: case['date-created'], reverse=True)
        
    
        
#
# TFimage-stack: id: , type: 'tfimage-stack', images: [id], tfcase: (id), date-created: 
#
#
class TFimagestack():
    def __init__(self):
        pass