Welcome to the Thrimbletrimmer!

Example usage of the Node Module:

/// <reference path="../typings/tsd.d.ts" />
var Xannathor = require('Xannathor');
var Thrimbletrimmer = new Xannathor.Xannathor.Server('127.168.0.1',1337,'../Resources/AuthenticatedUserList.txt','../Videos');

var url= '';

url = Thrimbletrimmer.newVideo('oceans-clip-1234.mp4', 
							{type:'video/mp4',title:'Test Title',description:'Test Description',framerate:'24',width:'640',height:'264'}, 
							function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);

url = Thrimbletrimmer.newVideo('DB-TestClip.mp4', {}, function(data) {
	console.log("Success!")
	console.log(data);
});
console.log(url);