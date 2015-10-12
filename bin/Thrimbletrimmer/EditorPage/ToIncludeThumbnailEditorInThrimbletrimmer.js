/*
//Add thumbnailInfo as global variable that the plugin can write to.
var thumbnailInfo = {};

//Include thumbnailInfo in the extraData variable that gets included when submitting an edit.
var getExtraData = function() {
	var extraData = [{SessionId:$('#g-signin-sessionId').text()}, thumbnailInfo];
	return extraData;
}

//Call this function (or just stick the contents of it in where needed) to create the button and thumbnail editor popup window.
var AddThumbnailEditor(wubs) = function {
	$('#SubmitButton').before('<input type="button" id="SetThumbnail" value="Set Thumbnail"/>');
	$('#SetThumbnail').click(function() {
		var thumbnailEditor = window.open('ThumbnailEditor.html','Thumbnail Editor','width=800, height=600, scrollbars=yes');
		thumbnailEditor.video_source = wubs.src;
		thumbnailEditor.video_type = wubs.type;
		thumbnailEditor.video_width = wubs.width;
		thumbnailEditor.video_height = wubs.height;
		thumbnailEditor.video_framerate = wubs.framerate;
	});
}
*/