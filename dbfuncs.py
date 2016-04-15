###### Database utilities

import sqlite3 as sq
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

def connect_db():
    return sq.connect('example.db')
    


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




