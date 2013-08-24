%include header title="Showing: "+case.case_title

<body style="padding:70px">

%include navbar session=session

%include messages message=message

<form>
  <fieldset>
    <legend>{{case.case_title}}</legend>


  <div class="row-fluid">
    <div class="span3 offset1">
      <span class="label label-info">Last Name </span>
      {{case.lname}}
    </div>
    <div class="span4">
      <span class="label label-info">Medical Record Number </span>
      {{case.mrn}}
    </div>
    <div class="span4">
      <span class="label label-info">Accession Number </span>
      {{case.acc}}
    </div>
  </div> <!-- row-fluid -->

  <div class="row-fluid">
    <div class="span1 offset1">
      <span class="label label-info">History</span>
    </div>
    <div class="span9 well">
      {{case.history}}
    </div>
  </div> <!-- row-fluid -->

  <div class="row-fluid">
    <div class="span1 offset1">
      <span class="label label-info">Findings</span>
    </div>
    <div class="span9 well">
      {{case.findings}}
    </div>
  </div> <!-- row-fluid -->

  <div class="row-fluid">
    <div class="span1 offset1">
      <span class="label label-info">Discussion</span>
    </div>
    <div class="span9 well">
      {{case.discussion}}
    </div>
  </div> <!-- row-fluid -->

<div class="row-fluid">
  <div class="span4 pagination-centered">
    <a class="btn btn-primary" href="/editcase/{{case.case_id}}">Edit this case</a>
  </div>
  <div class="span8">
    <span class="btn btn-danger">Drag images here to upload
    <input id="fileupload" type="file" name="files" data-url="/upload_file_to/{{case.case_id}}" style="display:none" multiple>
    </span>
  </div>
</div> <!-- row-fluid -->

<hr>

<ul class="thumbnails">
</ul>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/js/jquery.ui.widget.js"></script>
<script src="/js/jquery.iframe-transport.js"></script>
<script src="/js/jquery.fileupload.js"></script>
<script src="/js/jquery.colorbox-min.js"></script>
<link rel="stylesheet" type="text/css" href="/css/colorbox.css">

<script>
$(function () {
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, data) {
        $.each(data.result, function (index, file) {
          $('ul.thumbnails').prepend("<li class='span4'><div class='thumbnail'><img><h3></h3><p><a /></p></div></li>");
          $('div.thumbnail:first img').attr('width',"300").attr('src',file.url);
          $('div.thumbnail:first a').attr('href',file.delete_url).text('Delete');
        });
    }
  });
});

$.ajax({
  url: '/get_images/{{case.case_id}}',
  dataType: 'json',
  success: function(data){
    $.each(data, function(index,img_url){
      var del_url = img_url.replace(/cases/g,"delete_image");
      $('ul.thumbnails').prepend("<li class='span4'><div class='thumbnail'><a href="+img_url+" class='grp'><img></a><h3></h3><p><a href="+del_url+">Delete</a></p></div></li>");
      $('div.thumbnail:first img').attr('width',"300").attr('src',img_url);
    });
    $("a.grp").colorbox({rel:'grp', transition:'none', scalePhotos:true, maxHeight:"75%", maxWidth:"75%", opacity:0 });
  }
});




</script>




</body>
</html>