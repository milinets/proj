import psycopg2
import psycopg2.extras

dbconn = psycopg2.connect(
                      host='ec2-54-221-236-207.compute-1.amazonaws.com',
                      database='dc2ogsq6j70hc',
                      user='gyjkvxbrcgbcrw', 
                      password = 'wviBCNb-y9lKv4SSHejQUD3h4X'
                      )

cursor = dbconn.cursor(cursor_factory=psycopg2.extras.DictCursor)


case_columns = ('case_id','case_title','mrn','lname','acc','history', \
                'findings','discussion','ddx','quiz_title','keywords', \
                'needs_follow_up','created_on','created_by','last_modified', \
                'permissions')


cursor.execute("""
CREATE TABLE cases (
    case_id        varchar PRIMARY KEY,
    case_title     varchar,
    mrn            varchar,
    acc            varchar,
    lname          varchar,
    history        varchar,
    findings       varchar,
    discussion     varchar,
    ddx            varchar,
    quiz_title     varchar,
    keywords       varchar,
    needs_follow_up  varchar,
    created_on     varchar,
    created_by     varchar,
    last_modified  varchar,
    permissions    varchar
)
""")

"""
dbconn.commit()
cursor.close()
dbconn.close()
"""