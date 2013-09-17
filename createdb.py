import psycopg2
import psycopg2.extras
from psycopg2.extras import Json

pg_conn_string = "host='ec2-54-221-236-207.compute-1.amazonaws.com' \
                  dbname='dc2ogsq6j70hc' \
                  user='gyjkvxbrcgbcrw' \
                  password='wviBCNb-y9lKv4SSHejQUD3h4X'"

def connect_db():
    return psycopg2.connect(pg_conn_string)

def get_one_row(query,args=()):
    con = connect_db()
    dict_cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    dict_cur.execute(query,args)
    row = dict_cur.fetchone()
    con.commit()
    con.close()
    return row[0]

def get_all_rows(query,args=()):
    con = connect_db()
    dict_cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    dict_cur.execute(query,args)
    row = dict_cur.fetchall()
    con.commit()
    con.close()
    return row[0]

def query_db(query, args=(), one=False):
    con = connect_db()
    cur = con.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    con.commit()
    con.close()
    return (rv[0] if rv else None) if one else rv[0]


case_columns = ('case_id','case_title','mrn','lname','acc','history', \
                'findings','discussion','ddx','quiz_title','keywords', \
                'needs_follow_up','created_on','created_by','last_modified', \
                'permissions')

mydict = {'a':3,'b':'5','c':9}

newdictlist = query_db("""select * from cases""")

print(newdictlist)


