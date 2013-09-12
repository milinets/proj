###### Database utilities

import psycopg2
import psycopg2.extras

dbconn = psycopg2.connect(
                      host='ec2-54-221-236-207.compute-1.amazonaws.com',
                      database='dc2ogsq6j70hc',
                      user='gyjkvxbrcgbcrw', 
                      password = 'wviBCNb-y9lKv4SSHejQUD3h4X'
                      )
# dictionary cursor
 cursor = dbconn.cursor(cursor_factory=psycopg2.extras.DictCursor)
# tuple cursor
# cursor = dbconn.cursor()

# dbconn.commit()
# cursor.close()
# dbconn.close


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


"""