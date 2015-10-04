/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/Xannathor.d.ts" />
/// <reference path="../Xannathor/Xannathor.ts" />

var Thrimbletrimmer = new Xannathor.Xannathor.Server();

var url = Thrimbletrimmer.newVideo('1234', function(data) {
	console.log("Success!")
	console.log(data);
});

console.log(url);