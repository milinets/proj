import sqlite3 as sq 
import uuid
import datetime as dt

def connect():
    return sq.connect('data.db')

con = connect()
c = con.cursor()

def createdb():
    try:
        with con:
            con.execute("""
            CREATE TABLE cases
                (id TEXT PRIMARY KEY,
                time TEXT,
                info TEXT) """)
    except sq.IntegrityError:
        print("couldn't create cases")

def insertcase(info):
    id = uuid.uuid4()
    time = str(dt.datetime.now())
    try:
        c.execute("""
            INSERT INTO cases
            VALUES (?,?,?)""", (id,time,info,))
        con.commit()
    except sq.IntegrityError:
        print("couldn't create a case")
        
def showcases():
    try:
        c.execute("""
            SELECT * 
            FROM CASES""")
        for i in c.fetchall():
            print(i)
    