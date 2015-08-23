var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('../EditorPage')); //Serves the Editor page and other static content.
app.use(express.static('../Videos')); //Serves the video chunks to edit.

//Set Default Page.
app.get('/', function (req, res) {
    res.sendFile('default.html', { root: __dirname } );
});

//Returns the video data.
app.get('/getwubs/:a?', function (req, res) {
	fs.readFile('../Videos/videolist.json', 'utf8', function (err, data) {
		if (err) {
			res.sendStatus(500);
			return console.log(err);
		}
		var jsonData = JSON.parse(data);
		for (var i = 0; i < jsonData.length; i++) {
			if(jsonData[i].vidID == req.params.a) {
				var video = jsonData[i];
				var data = { 
					vidID:video.vidID,
					src:video.src,
					type:video.type,
					title:video.title,
					description:video.description,
					framerate:video.framerate
				};
				res.json(data);
				break;
			}
		}
	});
});

// accept POST request
app.post('/setwubs', function (req, res) {
	console.log(req.body);
	res.send('Got a POST request');
});

app.listen(1337)
console.log('Server running at http://127.0.0.1:1337/');
//console.log('Access the Editor at http://127.0.0.1:1337/Thrimbletrimmer.html?Video=1234');