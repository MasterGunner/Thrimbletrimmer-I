Welcome to the Thrimbletrimmer!

Example usage of the Node Module:
-----------------------------------------------------------------------------------------------
/// <reference path="../typings/tsd.d.ts" />
var Thrimbletrimmer = require('Thrimbletrimmer');
var editor = new Thrimbletrimmer.Xannathor.Server('localhost',1337,'../Resources/AuthenticatedUserList.txt','../Videos');

var url= '';

url = editor.newVideo('oceans-clip-1234.mp4', 
							{type:'video/mp4',title:'Test Title',description:'Test Description',framerate:'24',width:'640',height:'264'}, 
							function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);

url = editor.newVideo('DB-TestClip.mp4', {}, function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);
-----------------------------------------------------------------------------------------------

Example returned URL:
http://localhost:1337/Thrimbletrimmer.html?Video=7988

Example return data for the callback function.
{ vidID: '9135',
  start: '10',
  end: '591.926213',
  title: 'Desert Bus Clip',
  description: 'A clip from Desert Bus.' }