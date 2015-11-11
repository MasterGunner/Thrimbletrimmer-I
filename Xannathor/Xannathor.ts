//Are you tired of all your packets going where you tell them?
//Why not try Dave's Discount Server, where we have top men sending packets for you!
//Watch as our trained professionals wrap up all the packets and put them in the tubes.

/// <reference path="../typings/tsd.d.ts" />

/// <reference path="Utilities.ts" />
/// <reference path="WubloaderIntegration.ts" />
/// <reference path="Constants.ts" />

var express = require('express');
var bodyParser = require('body-parser');

module Thrimbletrimmer {
	export module Xannathor {
		export class Server {
			private app: any; //Webserver base.
			
			constructor(hostname: string, port: number, UserList:Array<string>, VideosLocation:string, LogFolder:string, APIKey:string, isDev:boolean) {
				if (typeof isDev === "undefined") { isDev = false; }
				
				//Insantiate and configure the base web server.
				Constants.HOSTNAME = hostname;
				Constants.PORT = port;
				Constants.VIDEOSLOCATION = VideosLocation;
				Constants.LOGFOLDER = LogFolder;
				Constants.APIKEY = APIKey;
				Constants.ISDEV = (typeof isDev === "undefined") ? false:isDev;
				
				this.app = express();
				this.configureServerDefaults();
				this.configureAuth(UserList);
				this.configureVideoFunctions();
				
				this.app.listen(port);
				Utilities.log('Server running at http://' + hostname + ':' + port);
			}

			//
			//Configuration Functions
			//
			configureServerDefaults(): void {
				//Set resources the server will need.
				this.app.use(bodyParser.json());
				this.app.use(bodyParser.urlencoded({extended:false}));
				this.app.use(express.static(Constants.EDITORPAGELOCATION)); //Serves the Editor page and other static content.
				this.app.use(express.static(Constants.VIDEOSLOCATION)); //Serves the video chunks to edit.
				
				//Test Page for development.
				if(Constants.ISDEV) {
					this.app.get('/', function (req, res) {
						var indexPage = '';
						WubloaderIntegration.getVideos().forEach(function(video) {
							indexPage += '<li><a href="/Thrimbletrimmer.html?Video='+video[0].vidID+'">'+video[0].vidID+'</a></li>'
						});
						indexPage = '<body><ul>' + indexPage + '</ul></body>'
						res.type('html');
						res.send(indexPage);
					});
				}
			}
			
			configureAuth(UserList:Array<string>): void {
				//Load authenticated user list.
				Utilities.authorizedUsers = UserList;
				
				//Initial Authentication call
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
				
				this.app.get('/getGoogleID', function (req, res) {
					if(Utilities.OVERRIDEAUTH) { res.send("AuthOverride"); }
					else { res.send(Constants.APIKEY); }
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
							res.status(400).send('Unable to retrieve video.');
						}
					} else {
						res.status(401).send('Cannot validate session, please refresh and try again.');
					}
				});
				
				//Accept POST request with edit information.
				this.app.post('/setwubs', function (req, res) {
					Utilities.log("Recieved Edit Request");
					if(Utilities.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
						//really should handle this with promises
						var submission = WubloaderIntegration.submitVideo(req.body);
						if (submission[0]) {
							res.send('Received Video Edits');
						} else {
							res.status(400).send(submission[1]);
						}
					} else {
						res.status(401).send('Cannot validate session. Please refresh and try again.');
					}
				});
			}
			
			//
			//Public Functions
			//
			newVideo(source:string, options:WubloaderIntegration.video, deleteOnSubmit:boolean, callback:Function): string {
				return WubloaderIntegration.newVideo(source, options, deleteOnSubmit, callback);
			}
			updateUserList(UserList:Array<string>) {
				Utilities.OVERRIDEAUTH = (UserList.length) ? false:true; //If empty User List, disable Auth.
				Utilities.authorizedUsers = UserList;
			}
			overrideAuth(override:boolean) {
				Utilities.OVERRIDEAUTH = override;
			}
		}
	}
}