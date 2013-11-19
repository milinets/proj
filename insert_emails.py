from flanker.addresslib import address
from userclass import TFuser

with open('residentemails.txt') as f:
	mystr = f.read()

addlist = []
myuser = TFuser()

for a in address.parse_list(mystr):
	addlist.append(address.parse(str(a), addr_spec_only=True))

for a in addlist:
	dict = myuser.getbyemail(str(a))
	print dict	
