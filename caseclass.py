import bottle
import psycopg2
import psycopg2.extras
import uuid
import json
import datetime
from dbfuncs import connect_db, pg_conn_string

# 
# TFcase: visible: (yes, no, owner), type: 'tfcase', title: , quiz-title: , author: (id), contributors: [id], 
#          keywords: [], images: [id], image-stacks: [id], history, findings, diagnosis, discussion,
#          lname, mrn, acc, date-created: , date-read: , date-updated: , needs-follow-up: 
#

class TFcase(object):
    def create(self, data):
        case_id = str(uuid.uuid4())
        data['id'] = case_id
        data['type'] = 'tfcase'
        data['date-created'] = datetime.datetime.now().isoformat()
        datastring = json.dumps(data)
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO dba VALUES (%s)", (datastring,))
        conn.commit()
        cur.close()
        conn.close()
        self.data = data
        return data
    
    def read(self, case_id):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from dba WHERE data->>'id' = %s",(case_id,))
        data = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        self.data = data
        return data
        
    def update(self, data):
        conn=connect_db()
        cur = conn.cursor()
        case_id = data['id']
        data['date-updated'] = datetime.datetime.now().isoformat()
        datastring = json.dumps(data)
        cur.execute("UPDATE dba SET data = %s WHERE data->>'id' = %s",(datastring,case_id))
        conn.commit()
        cur.close()
        conn.close()
        return data
    
    def delete(self, case_id):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from dba WHERE data->>'id' = %s",(case_id,))
        data = cur.fetchone()[0]
        print data
        data['deleted'] = True
        datastring = json.dumps(data)
        cur.execute("UPDATE dba SET data = %s WHERE data->>'id' = %s",(datastring, case_id))
        conn.commit()
        cur.close()
        conn.close()
    
    def search(self, searchstring):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("""SELECT data from dba WHERE to_tsvector('english',data::text) 
                                                    @@ to_tsquery('english',%s);""", (searchstring,))
#        cur.execute("SELECT data from dba WHERE data->>'type' = 'tfcase' and data::text LIKE %s",('%'+searchstring+'%',))
        data = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for case in data:
            case = case[0]
            if not case.get('deleted'):
                mylist.append(case)
        return mylist
    
    def list_all_cases(self):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data FROM dba WHERE data->>'type' = 'tfcase' ORDER BY data->>'date-updated' DESC")
        data = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for case in data:
            case = case[0]
            if not case.get('deleted'):
               mylist.append(case)
        return mylist