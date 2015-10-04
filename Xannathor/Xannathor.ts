//Are you tired of all your packets going where you tell them?
//Why not try Dave's Discount Server, where we have top men sending packets for you!
//Watch as our trained professionals wrap up all the packets and put them in the tubes.

/// <reference path="../typings/tsd.d.ts" />

/// <reference path="Utilities.ts" />
/// <reference path="WubloaderIntegration.ts" />

var express = require('express');
var bodyParser = require('body-parser');

module Xannathor {
	export module Xannathor {
		export class Server {
			private app: any; //Webserver base.
			
			constructor() {
				//Insantiate and configure the base web server.
				this.app = express();
				this.configureServerDefaults();
				this.configureGoogleAuth();
				this.configureVideoFunctions();
				
				this.app.listen(1337);
				Utilities.log('Server running at http://127.0.0.1:1337/');
			}

			//
			//Configuration Functions
			//
			configureServerDefaults(): void {
				//Set resources the server will need.
				this.app.use(bodyParser.json());
				this.app.use(bodyParser.urlencoded({extended:false}));
				this.app.use(express.static('../EditorPage')); //Serves the Editor page and other static content.
				this.app.use(express.static('../Videos')); //Serves the video chunks to edit.
				
				//Set Default Page. Only for testing purposes.
				this.app.get('/', function (req, res) {
					res.sendFile('default.html', { root: __dirname + '/../Resources' } );
				});
			}
			
			configureGoogleAuth(): void {
				//Initial Authentication
				this.app.post('/tokensignin', function (req, res) {
					//Utilities.log(req.body);
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
			}
			
			configureVideoFunctions(): void {
				//Returns the video data.
				this.app.get('/getwubs/:a?', function (req, res) {
					if(Utilities.validateSessionId(req.query.SessionId)) {
						var videoData  = WubloaderIntegration.getVideo(req.params.a);		
						if(videoData) {
							res.json(videoData);
						} else {
							res.sendStatus(400);
						}
					} else {
						res.sendStatus(401);
					}
				});
				
				//Accept POST request with edit information.
				this.app.post('/setwubs', function (req, res) {
					Utilities.log(req.body);
					if(Utilities.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
						if (WubloaderIntegration.submitVideo(req.body)) {
							res.send('Recieved Video Edits');
						} else {
							res.sendStatus(500);
						}
					} else {
						res.sendStatus(401);
					}
				});
			}
			
			//
			//Public Functions
			//
			newVideo(videoID: string, callback:Object): string {
				return WubloaderIntegration.newVideo(videoID, callback);
			}
		}
	}
}