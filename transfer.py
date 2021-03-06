from dbfuncs import *
from caseclass import *

def transfertodba():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("select row_to_json(cases) from cases;")
    for olddata in cur.fetchall():
    	newcase = TFcase()
    	olddata = olddata[0]
    	newdata = {}
    	newdata['title'] = olddata.get('case_title')
    	newdata['lname'] = olddata.get('lname')
    	newdata['mrn'] = olddata.get('mrn')
    	newdata['acc'] = olddata.get('acc')
    	newdata['datadump'] = json.dumps(olddata)
    	newcase.create(newdata)
    conn.commit()
    cur.close()
    conn.close()

def updatedba():
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("select data->>'id' from dba where (data->'datadump') is not null;")
    data = cur.fetchall()
    for case in data:
    	caseid = case[0]
    	mycase = TFcase()
    	print mycase.read(caseid)
    conn.commit()
    cur.close()
    conn.close()

