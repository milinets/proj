###### Database utilities

import sqlite3 as sq
import uuid
import json
import os
import socket

def connect_db():
    return sq.connect('data.db')

def createTable(name):
    con = connect_db()
    with con:
        cur = con.cursor()
        cur.execute("""
            CREATE TABLE {}
                (id TEXT PRIMART KEY,
                type TEXT,
                info TEXT,
                timecreated TEXT,
                createdby TEXT,
                log TEXT)
        """.format(name))

def show_rows(name):
    conn = connect_db()
    with conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT *
            FROM {}
        """.format(name))
        for i in cur.fetchall():
            print(i)


def query_db(query, args=(), one=False):
    con = connect_db()
    with con:
        cur = con.cursor()
        cur.execute(query, args)


import uuid

def gen_id():
    return str(uuid.uuid4())
                
for i in range(10):
    print(gen_id()[-12:])
