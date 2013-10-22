###### Database utilities

import psycopg2
import psycopg2.extras
import uuid
import json
import os

thishost = os.uname()
if 'Darwin' in thishost:
    pg_conn_string = """
        dbname='me' 
        user='me'
    """
elif 'proj-38857' in thishost:
    pg_conn_string = """
                    dbname='action' 
                    user='action'
             """
else:
    pg_conn_string = """
                    dbname='postgres' 
                    user='postgres'
    """

    
# dictionary cursor
# cursor = dbconn.cursor(cursor_factory=psycopg2.extras.DictCursor)

def connect_db():
    return psycopg2.connect(pg_conn_string)


def query_db(query, args=(), one=False):
    con = connect_db()
    cur = con.cursor()
    cur.execute(query, args)
    con.commit()
    con.close()

def createdb():
    conn = connect_db()
    cur = conn.cursor()
#    cur.execute("CREATE EXTENSION uuid-ossp")
#    cur.execute("CREATE TABLE db (id uuid primary key default uuid_generate_v4(), data json)")
    cur.execute("CREATE TABLE db (id uuid primary key, data json)")
    conn.commit()
    cur.close()
    conn.close()

def case_create(data):
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

def case_read(case_id):
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT data from db WHERE id = %s",(case_id,))
    data = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    data['id'] = case_id
    return data
    
def case_update(case_id, data):
    conn=connect_db()
    cur = conn.cursor()
    datastring = json.dumps(data)
    cur.execute("UPDATE db SET data = %s WHERE id = %s",(datastring,case_id))
    conn.commit()
    cur.close()
    conn.close()
    data['id'] = case_id
    return data

def case_delete(case_id):
    conn=connect_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM db WHERE id = %s",(case_id,))
    conn.commit()
    cur.close()
    conn.close()
    return True    

def case_search(searchstring):
    conn=connect_db()
    cur = conn.cursor()
    cur.execute("SELECT id, data from db WHERE data::text LIKE %s",('%'+searchstring+'%',))
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

def list_all_cases():
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
            mylist.append(mydict)
        except:
            print mydict + " Doesn't work"
    return mylist