Welcome to the Thrimbletrimmer!

Example usage of the Node Module:

```
/// <reference path="../typings/tsd.d.ts" />
var Thrimbletrimmer = require('Thrimbletrimmer');
var editor = new Thrimbletrimmer.Xannathor.Server('localhost',1337,'../Resources/AuthenticatedUserList.txt','../Videos', '../logs');

var url= '';

url = editor.newVideo('oceans-clip-1234.mp4', 
							{type:'video/mp4',
							title:'Test Title',
							description:'Test Description',
							framerate:'24',
							width:'640',
							height:'264'}, 
							false, //Do not delete video from queue on submission.
							function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);

//This will use the default properties, except for setting a start/end offset, and delete the video from the queue on submission.
url = editor.newVideo('DB-TestClip.mp4', {startOffset:120, endOffset:180}, true, function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);
```

Example returned URL:
http://localhost:1337/Thrimbletrimmer.html?Video=7988

Example return data for the callback function. 'Start' and 'End' are in seconds.
```
{ vidID: '2549',
  startOffset: '10',
  endOffset: '591.926213',
  title: 'Desert Bus Clip',
  description: 'A clip from Desert Bus.',
  source: 'DB-TestClip.mp4',
  type: 'video/mp4',
  framerate: 30,
  width: 640,
  height: 360,
  deleteOnSubmit: true }
 ```
  
If the contents of the Authenticated User List changes, you can reload it:
```
editor.Utilities.loadAuthorizedUsers()
``` 

Default video property values:
* type: "video/mp4"
* title: "Desert Bus Clip"
* description: "A clip from Desert Bus."
* framerate: 30
* width: 640
* height: 360
* startOffset: 0
* endOffset: 0
