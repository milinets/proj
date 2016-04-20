from flanker.addresslib import address
from userclass import TFuser

roletypes = ['emailsfaculty.txt','emailsresidents.txt','emailsfellows.txt']
myuser = TFuser()

for role in roletypes:
	with open(role) as thefile:
		emailList = thefile.read()
	emailList = address.parse_list(emailList)
	emailList = [str(address.parse(str(elem), addr_spec_only=True)).lower() for elem in emailList]
	for addr in emailList:
		data = myuser.create_user_in_db(addr)
		if role == 'emailsfaculty.txt':
			data['role'] = 'faculty'
		elif role == 'emailsresidents.txt':
			data['role'] = 'resident'
		else:
			data['role'] = 'fellow'
		myuser.update(data)
		print myuser.data
		



"""
for a in addlist:
	dict = myuser.getbyemail(str(a))
	print dict	
"""