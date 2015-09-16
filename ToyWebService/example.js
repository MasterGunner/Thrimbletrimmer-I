var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var GoogleAuth = require('google-auth-library');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('../EditorPage')); //Serves the Editor page and other static content.
app.use(express.static('../Videos')); //Serves the video chunks to edit.

//
// UTILITY FUNCTIONS
//

<<<<<<< HEAD
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
=======
//Authentication
app.post('/tokensignin', function (req, res) {
	console.log(req.body);

	//Set up callback function.
	callback = function(authRes) {
		var body = '' //Response Output buffer;
		//Append chunks from response to output buffer.
		authRes.on('data', function (chunk) {
			body += chunk;
		});
		//When response is completed, output entire response.
		authRes.on('end', function () {
			console.log(body);
			
			//Confirm signed-in user is in list of valid users.
			var userInfo = JSON.parse(body);
>>>>>>> b4c29a97312a146871e00c3458ba51d756e81a52
			var userEmail = userInfo.email;
			var AuthUserList = fs.readFileSync('./AuthenticatedUserList.txt').toString().split("\n");
			if (AuthUserList.indexOf(userEmail) >= 0) {
				console.log('User Authenticated: '+userEmail);
<<<<<<< HEAD
				callback(true, generateSessionId(userInfo));
			} else {
				console.log('User Not Authenticated: '+userEmail);
				callback(false, null);
			}
=======
				res.send('User Authenticated: '+userEmail);
			} else {
				console.log('User Not Authenticated: '+userEmail);
				res.send('User Not Authenticated: '+userEmail);
			}
		});
	}

	//Make the request.
	var authReq = https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+req.body.id_token, callback).end();
});

//Returns the video data.
app.get('/getwubs/:a?', function (req, res) {
	fs.readFile('../Videos/videolist.json', 'utf8', function (err, data) {
		if (err) {
			res.sendStatus(500);
			return console.log(err);
>>>>>>> b4c29a97312a146871e00c3458ba51d756e81a52
		}
	}

	//Validate user token with Google.
	console.log(id_token); //For some reason, if this is commented out, the verifyIdToken function fails.
	(new (new GoogleAuth).OAuth2).verifyIdToken(id_token,null,authValidation);
	//(new (new GoogleAuth).OAuth2).verifyIdToken(token,null,function(a,b) { if(a) { console.log(a); } else {console.log(b.getPayload()); x=b.getPayload(); } });
}

var generateSessionId = function(userInfo) {
	return 1234567890;
}

var validateSessionId = function(sessionId) {
	return (sessionId == 1234567890) ? true:false;
}

var getVideo = function(videoId) {
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
// HTTP RESPONSE FUNCTIONS
//

//Set Default Page.
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