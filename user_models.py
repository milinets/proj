import bottle
import sqlite3 as sq

def connect_db():
    return sq.connect('users.db')

con = connect_db()
with con:
    cur = con.cursor()
#    cur.execute('drop table users')
    cur.execute("""
    CREATE TABLE if not exists users
    (id TEXT PRIMARY KEY,
    name TEXT,
    hash TEXT,
    email TEXT,
    role TEXT)
    """)

def show_users():
    con = connect_db()
    with con:
        cur.execute("""
        SELECT *
        FROM users
        """)
        return cur.fetchall()

class User(object):
    def __init__(self,id=None,name=None,hash=None,email=None,role=None):
        if id==None:
            self.id = str(uuid.uuid4())[-12:]
        else:
            self.id = id
        self.name=name
        self.email=email
        self.role=role
        self.hash=hash
    
    def usertuple(self):
        return (self.id,self.name,self.email,self.role)

    def create_user(self):
        con = connect_db()
        with con:
            cur = con.cursor()
            cur.execute("""
            INSERT INTO users (id,name,email,role)
            VALUES (?,?,?,?)        
            """, (self.id,self.name,self.email,self.role))

    def read_user(id):
        con = connect_db()
        with con:
            cur = con.cursor()
            cur.execute("""
            SELECT * 
            FROM users
            WHERE id=?
            """, (id,))
            thisuser = cur.fetchone()
            if thisuser:
                return User(*thisuser)
            else:
                return False
    
    def update_user(self):
        con = connect_db()
        with con:
            cur = con.cursor()
            cur.execute("""
            UPDATE users
            SET name=?,email=?,role=?
            WHERE id=?
            """,(self.name,self.email,self.role,self.id))
        return True

    def delete_user(self):
        con = connect_db()
        with con:
            cur = con.cursor()
            cur.execute("""
            UPDATE users
            SET role='deleted'
            WHERE id=?
            """,(self.id,))
        return True
        
    def really_delete_user(self):
        con = connect_db()
        with con:
            cur = con.cursor()
            cur.execute("""
            DELETE FROM users
            WHERE id=?
            """,(self.id,))
        return True