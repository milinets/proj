###### Database utilities

import sqlite3 as sq
import uuid
import json
import os
import socket

def connect_db():
    return sq.connect('example.db')

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
            print i


def query_db(query, args=(), one=False):
    con = connect_db()
    with con:
        cur = con.cursor()
        cur.execute(query, args)


import datetime as dt 
import base64
import random

def gen_id():
    return base64.urlsafe_b64encode(str(random.random()))[-10:]
                
for i in range(10):
    print gen_id()
