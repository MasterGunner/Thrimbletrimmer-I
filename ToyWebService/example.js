//standard libraries.
var https = require('https');
var fs = require('fs');

//npm install express, body-parser, and google-auth-library.
var express = require('express');
var bodyParser = require('body-parser');
var GoogleAuth = require('google-auth-library');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('../EditorPage')); //Serves the Editor page and other static content.
app.use(express.static('../Videos')); //Serves the video chunks to edit.

//
// WUBLOADER FUNCTIONS
//

var getVideo = function(videoId) {
	//Test function only. Replace with calls to the Wubloader for video information.
	var response = false;
	try {
		var jsonData = JSON.parse(fs.readFileSync('../Videos/videolist.json', 'utf8'));
		for (var i = 0; i < jsonData.length; i++) {
			if(jsonData[i].vidID == videoId) {
				var video = jsonData[i];
				var data = { 
					vidID:video.vidID,
					src:video.src,
					type:video.type,
					title:video.title,
					description:video.description,
					framerate:video.framerate
				};
				response = data;
				break;
			}
		}
	} catch (err) {
		console.log(err);
	}
	return response;
}

var submitVideo = function(data) {
	//Do something.
}

//
// UTILITY FUNCTIONS
//

//General Authentication
var vstAuth = function(id_token, callback) {
	//Set up callback function.
	authValidation = function(err, body) {
		if(err) {
			console.log("Error Authenticating OAuth Token:");
			console.log(err);
			callback(false, null);
		} else {
			var userInfo = body.getPayload();
			var userEmail = userInfo.email;
			var AuthUserList = fs.readFileSync('./AuthenticatedUserList.txt').toString().split("\n");
			if (AuthUserList.indexOf(userEmail) >= 0) {
				console.log('User Authenticated: '+userEmail);
				callback(true, generateSessionId(userInfo));
			} else {
				console.log('User Not Authenticated: '+userEmail);
				callback(false, null);
			}
		}
	}

	//Validate user token with Google.
	id_token; //For some reason, if this is commented out, the verifyIdToken function fails.
	(new (new GoogleAuth).OAuth2).verifyIdToken(id_token,null,authValidation);
	//(new (new GoogleAuth).OAuth2).verifyIdToken(token,null,function(a,b) { if(a) { console.log(a); } else {console.log(b.getPayload()); x=b.getPayload(); } });
}

var generateSessionId = function(userInfo) {
	return 1234567890;
}

var validateSessionId = function(sessionId) {
	return (sessionId == 1234567890) ? true:false;
}

//
// HTTP RESPONSE FUNCTIONS
//

//Set Default Page. Only for testing purposes.
app.get('/', function (req, res) {
    res.sendFile('default.html', { root: __dirname } );
});

//Initial Authentication
app.post('/tokensignin', function (req, res) {
	//console.log(req.body);
	vstAuth(req.body.id_token, function(isAuth, sessionId) {
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
	if(validateSessionId(req.query.SessionId)) {
		var videoData  = getVideo(req.params.a);		
		if(videoData) {
			res.json(videoData);
		} else {
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(401);
	}
});

//Accept POST request
app.post('/setwubs', function (req, res) {
	console.log(req.body);
	if(validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
		submitVideo(req.body);
		res.send('Recieved Video Edits');
	} else {
		res.sendStatus(401);
	}
});

app.listen(1337)
console.log('Server running at http://127.0.0.1:1337/');
//console.log('Access the Editor at http://127.0.0.1:1337/Thrimbletrimmer.html?Video=1234');