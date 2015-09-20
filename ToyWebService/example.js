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

//Namespace for new functions.
var vst = vst || {};

//
// WUBLOADER FUNCTIONS
//

vst.getVideo = function(videoId) {
	//Test function only. Replace with calls to the Wubloader for video information.
	var response = false;
	try {
		///////////////////////////////////////////////////////////////////////////////////////////
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
		///////////////////////////////////////////////////////////////////////////////////////////
	} catch (err) {
		vst.log(err);
	}
	return response;
}

vst.submitVideo = function(data) {
	var successfulSubmission = false;
	if(vst.validateVideoSubmission(data)) {
		try {
			//Do something.
			///////////////////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////////////////
			successfulSubmission = true;
		} catch (err) {
			vst.log(err);
		}
	}
	return successfulSubmission
}

//
// UTILITY FUNCTIONS
//

//Logging
vst.log = function(message) {
	console.log(message);
}

//Video Input Validation
vst.validateVideoSubmission = function (data) {
	var validation = false;
	if(data.vidID && data.start && data.end && data.title && data.description) {
		if(data.start < data.end && data.title.length <= 91 ) {
			validation = true;
		}
	}
	return validation;
}

//General Authentication
vst.auth = function(id_token, callback) {
	//Set up callback function.
	var authValidation = function(err, body) {
		if(err) {
			vst.log("Error Authenticating OAuth Token:");
			vst.log(err);
			callback(false, null);
		} else {
			var userInfo = body.getPayload();
			var userEmail = userInfo.email;
			var authUserList = fs.readFileSync('./AuthenticatedUserList.txt').toString().split("\n");
			if (authUserList.indexOf(userEmail) >= 0) {
				vst.log('User Authenticated: '+userEmail);
				callback(true, vst.generateSessionId(userInfo));
			} else {
				vst.log('User Not Authenticated: '+userEmail);
				callback(false, null);
			}
		}
	}

	//Validate user token with Google.
	//id_token; //For some reason, if this is commented out, the verifyIdToken function fails. //Ok, wrapping the verify function in a try/catch fixes it.
	try {
		(new (new GoogleAuth).OAuth2).verifyIdToken(id_token,null,authValidation);
	} catch (err) {
		vst.log(err);
	}
}

//Replace these with better session handling using the express-session library?
vst.generateSessionId = function(userInfo) {
	return 1234567890;
}
vst.validateSessionId = function(sessionId) {
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
	//vst.log(req.body);
	vst.auth(req.body.id_token, function(isAuth, sessionId) {
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
	if(vst.validateSessionId(req.query.SessionId)) {
		var videoData  = vst.getVideo(req.params.a);		
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
	vst.log(req.body);
	if(vst.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
		if (vst.submitVideo(req.body)) {
			res.send('Recieved Video Edits');
		} else {
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(401);
	}
});

app.listen(1337)
vst.log('Server running at http://127.0.0.1:1337/');
//vst.log('Access the Editor at http://127.0.0.1:1337/Thrimbletrimmer.html?Video=1234');