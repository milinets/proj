%if get('message',None):
	<link rel="stylesheet" type="text/css" href="/css/libnotify.css">
	<script src="/js/humane.min.js"></script>
	<script type="text/javascript">
	%for i in message:
		humane.log('{{i}}');
	</script>
	%end
%end