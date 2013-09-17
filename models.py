###### Database utilities

import psycopg2
import psycopg2.extras
pg_conn_string = "host='127.0.0.1' dbname='tf' user='postgres' password='a'"

def connect_db():
    return psycopg2.connect(pg_conn_string)

def query_db(query, args=(), one=False):
    con = connect_db()
    cur = con.cursor()
    cur.execute(query, args)
    rv = [dict((cur.description[idx][0],value) for idx, value in enumerate(row)) for row in cur.fetchall()]
    con.commit()
    con.close()
    return (rv[0] if rv else None) if one else rv

def get_one_row(query,args=()):
    con = connect_db()
    dict_cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    dict_cur.execute(query,args)
    row = dict_cur.fetchone()
    con.commit()
    con.close()
    return row

def get_all_rows(query,args=()):
    con = connect_db()
    dict_cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
    dict_cur.execute(query,args)
    row = dict_cur.fetchall()
    con.commit()
    con.close()
    return row

###### Login utilities

import random
import hashlib
import hmac
from string import letters
from collections import namedtuple
import uuid


def make_salt(length = 5):
    return ''.join(random.choice(letters) for x in xrange(length))

def make_pw_hash(name, pw, salt = None):
    if not salt:
        salt = make_salt()
    h = hashlib.sha256(name + pw + salt).hexdigest()
    return '%s,%s' % (salt, h)

def valid_pw(name, password, h):
    salt = h.split(',')[0]
    return h == make_pw_hash(name, password, salt)

def users_key(group = 'default'):
    return db.Key.from_path('users', group)

def get_id():
    return str(uuid.uuid4().hex)

user_columns = ('username','password','first_name','last_name','email','classification')

class User(object):
    def __init__(self, user_dict={}):
        for k in user_columns:
            setattr(self,k,'')
        self.__dict__.update(user_dict)

    def checkpassword(self,checkpassword):
        return valid_pw(self.username,checkpassword,self.password)

    def create(self):
        self.password = make_pw_hash(self.username, self.password)
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, password, first_name, last_name, email, classification) \
            VALUES (%s,%s,%s,%s,%s,%s)",
            (self.username, self.password, self.first_name, self.last_name, self.email, 'Basic'))
        conn.commit()
        conn.close()

    def read(self,username):
        try:
            for k,v in query_db("SELECT * FROM users WHERE username = %s",(username,),True).items():
                setattr(self, k, v)
            return True
        except:
            return False

    def update(self):
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = "UPDATE users SET (password, first_name,last_name,email,classification)="
        query += "(%(password)s,%(first_name)s,%(last_name)s,%(email)s,%(classification)s) "
        query += "WHERE username = %(username)s"
        cur.execute(query,self.__dict__)
        conn.commit()
        conn.close()
        

case_columns = ('case_id','case_title','mrn','lname','acc','history', \
                'findings','discussion','ddx','quiz_title','keywords', \
                'needs_follow_up','created_on','created_by','last_modified', \
                'permissions')

class Case(object):
    def __init__(self,case_dict={}):
        for k in case_columns:
            setattr(self,k,'')
        self.needs_follow_up = True
        for k,v in case_dict.items():
            setattr(self, k, v)

    def create(self):
        self.case_id = get_id()
        conn = connect_db()
        cur = conn.cursor()
        query = "INSERT INTO cases (case_id,case_title,mrn,lname,acc,history,findings,"
        query += "discussion,ddx,quiz_title,keywords,needs_follow_up,created_on,created_by,"
        query += "last_modified,permissions) VALUES (%(case_id)s,%(case_title)s,%(mrn)s,%(lname)s,"
        query += "%(acc)s,%(history)s,%(findings)s,%(discussion)s,%(ddx)s,%(quiz_title)s,"
        query += "%(keywords)s,%(needs_follow_up)s,'now',%(created_by)s,'now',%(permissions)s)"
        cur.execute(query,self.__dict__)
        conn.commit()
        conn.close()              

    def read(self,case_id):
        try:
            for k,v in query_db("SELECT * FROM cases WHERE case_id = %s",(case_id,),True).items():
                setattr(self, k, v)
            return True
        except:
            return False

    def update(self):
        conn = connect_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        query = "UPDATE cases SET (case_title,mrn,lname,acc,history,findings, \
            discussion,ddx,quiz_title,keywords,needs_follow_up,last_modified,permissions)="
        query += "(%(case_title)s,%(mrn)s,%(lname)s,%(acc)s,%(history)s,%(findings)s"
        query += ",%(discussion)s,%(ddx)s,%(quiz_title)s,%(keywords)s,%(needs_follow_up)s,current_timestamp,%(permissions)s) "
        query += "WHERE case_id = %(case_id)s"
        cur.execute(query,self.__dict__)
        conn.commit()
        conn.close()

    def delete(self):
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM cases WHERE case_id = %(case_id)s",self.__dict__)
        conn.commit()
        conn.close()

