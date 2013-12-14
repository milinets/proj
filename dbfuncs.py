###### Database utilities

import psycopg2
import psycopg2.extras
import uuid
import json
import os
import socket
import platform

thishost = platform.uname()

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

def createdb(name):
    conn = connect_db()
    cur = conn.cursor()
#    cur.execute("CREATE EXTENSION uuid-ossp")
#    cur.execute("CREATE TABLE db (id uuid primary key default uuid_generate_v4(), data json)")
    cur.execute("CREATE TABLE db (id uuid primary key, data json)", (name,))
    conn.commit()
    cur.close()
    conn.close()




