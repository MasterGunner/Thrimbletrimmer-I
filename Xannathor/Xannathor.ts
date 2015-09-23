//Are you tired of all your packets going where you tell them?
//Why not try Dave's Discount Server, where we have top men sending packets for you!
//Watch as our trained professionals wrap up all the packets and put them in the tubes.

/// <reference path="../Definitions/node.d.ts" />
/// <reference path="Utilities.ts" />
/// <reference path="WubloaderIntegration.ts" />

//npm install express, body-parser, and google-auth-library.
import express = require('express');
import bodyParser = require('body-parser');

var app = express();
var Utilities = Xannathor.Utilities;
var Wubloader = Xannathor.WubloaderIntegration.WubInt;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('../EditorPage')); //Serves the Editor page and other static content.
app.use(express.static('../Videos')); //Serves the video chunks to edit.

//
// HTTP RESPONSE FUNCTIONS
//

//Set Default Page. Only for testing purposes.
app.get('/', function (req, res) {
    res.sendFile('default.html', { root: __dirname } );
});

//Initial Authentication
app.post('/tokensignin', function (req, res) {
	//vst.log(req.body);
	Utilities.auth(req.body.id_token, function(isAuth, sessionId) {
		if(isAuth) {
			var data = {Response:'User Authenticated', SessionId:sessionId}
			res.json(data);
		} else {
			var data = {Response:'User Not Authenticated', SessionId:sessionId}
			res.json(data);
		}
	});
});

//Returns the video data.
app.get('/getwubs/:a?', function (req, res) {
	if(Utilities.validateSessionId(req.query.SessionId)) {
		var videoData  = Wubloader.getVideo(req.params.a);		
		if(videoData) {
			res.json(videoData);
		} else {
			res.sendStatus(400);
		}
	} else {
		res.sendStatus(401);
	}
});

//Accept POST request
app.post('/setwubs', function (req, res) {
	Utilities.log(req.body);
	if(Utilities.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
		if (Wubloader.submitVideo(req.body)) {
			res.send('Recieved Video Edits');
		} else {
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(401);
	}
});

app.listen(1337)
Utilities.log('Server running at http://127.0.0.1:1337/');
