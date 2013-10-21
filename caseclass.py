import bottle
import psycopg2
import psycopg2.extras
import uuid
import json



def connect_db():
    return psycopg2.connect(pg_conn_string)

class TFCase(object):
    def case_create(self, data):
        case_id = str(uuid.uuid4().hex)
        datastring = json.dumps(data)
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO db (id,data) VALUES (%s,%s)", (case_id,datastring))
        conn.commit()
        cur.close()
        conn.close()
        data['id'] = case_id
        return data
    
    def case_read(self, case_id):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from db WHERE id = %s",(case_id,))
        data = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        data['id'] = case_id
        return data
        
    def case_update(self, case_id, data):
        conn=connect_db()
        cur = conn.cursor()
        datastring = json.dumps(data)
        cur.execute("UPDATE db SET data = %s WHERE id = %s",(datastring,case_id))
        conn.commit()
        cur.close()
        conn.close()
        data['id'] = case_id
        return data
    
    def case_delete(self, case_id):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data from db WHERE id = %s",(case_id,))
        data = cur.fetchone()[0]
        print data
        data['deleted'] = True
        datastring = json.dumps(data)
        cur.execute("UPDATE db SET data = %s WHERE id = %s",(datastring, case_id))
        conn.commit()
        cur.close()
        conn.close()
    
    def case_search(self, searchstring):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT id, data from db WHERE data->deleted <> TRUE AND data::text LIKE %s",('%'+searchstring+'%',))
        data = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for pair in data:
            id, mydict = pair
            try: 
                mydict['id'] = id.strip('-')
                mylist.append(mydict)
            except:
                print mydict + " Doesn't work"
        return mylist
    
    def list_all_cases(self):
        conn=connect_db()
        cur = conn.cursor()
        cur.execute("SELECT id, data from db")
        data = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        mylist = []
        for pair in data:
            id, mydict = pair
            try: 
                mydict['id'] = id.strip('-')
                if not mydict.get('deleted'):
                    mylist.append(mydict)
            except:
                print mydict + " Doesn't work"
        return mylist