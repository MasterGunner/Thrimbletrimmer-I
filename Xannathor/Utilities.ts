/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var GoogleAuth = require('google-auth-library');

module Thrimbletrimmer {
	export module Utilities {
		//Logging
		export function log (message:string): void {
			var datetime = (new Date()).toISOString().split("T");
			message = datetime[1] + " - " + message;
			var logFile = Constants.LOGFOLDER + "/" + Constants.HOSTNAME + datetime[0] + ".log" 
			fs.appendFile(logFile, message, function(err) { if (err) throw err; }); 
			console.log(message);
		}
		
		//Video Input Validation
		export function validateVideoSubmission (data: WubloaderIntegration.video): boolean { 
			if(data.vidID && data.startOffset && data.endOffset && data.title && data.description) {
				if(parseFloat(data.startOffset.toString()) < parseFloat(data.endOffset.toString())) {
					if (data.title.length <= 91) {
						return true;
					} else { Utilities.log("Failed Validation: Title longer than 91 characters"); } 
				} else { Utilities.log("Failed Validation: Start greater than End."); } 
			} else { Utilities.log("Failed Validation: Missing parameter. Require Video ID, Start, End, Title, and Description."); } 
			
			Utilities.log(JSON.stringify(data));
			return false;
		}
		
		//
		// Authentication Functions
		//
		
		//Set up Authentication
		export var authorizedUsers = [];
		
		//General Authentication
		export function auth (id_token: string, callback: Function): void {
			//Set up callback function.
			var authValidation = function(err, body) {
				if(err) {
					Utilities.log("Error Authenticating OAuth Token:");
					Utilities.log(err);
					callback(false, null);
				} else {
					var userInfo = body.getPayload();
					var userEmail = userInfo.email;
					if (authorizedUsers.indexOf(userEmail) >= 0) {
						Utilities.log('User Authenticated: '+userEmail);
						callback(true, Utilities.generateSessionId());
					} else {
						Utilities.log('User Not Authenticated: '+userEmail);
						callback(false, null);
					}
				}
			}
		
			//Validate user token with Google.
			//id_token; //For some reason, if this is commented out, the verifyIdToken function fails. //Ok, wrapping the verify function in a try/catch fixes it.
			try {
				(new (new GoogleAuth).OAuth2).verifyIdToken(id_token,null,authValidation);
			} catch (err) {
				Utilities.log(err);
			}
		}
		
		//Replace these with better session handling using the express-session library?
		var sessionIDs = [];
		export function generateSessionId(): string {
			cleanSessionIDs(); //Clean out old Session IDs first.
			if (sessionIDs.length > 5000) {
				sessionIDs = []; //If there are more than 5000 session IDs, clear them all to prevent performance degredation.
				log("Session ID array force-cleared. Sorry.");
			}
			
			var sessionID = Math.floor(Math.random() * 10000).toString();
			for (var i = 0; i < sessionIDs.length; i++) {
				if (sessionID === sessionIDs[i][0]) {
					generateSessionId();
					break;
				}
			}
			sessionIDs.push([sessionID, (new Date()).getTime()])
			return sessionID;
		}
		
		export function validateSessionId (sessionID: string): boolean {
			for (var i = 0; i < sessionIDs.length; i++) {
				if(sessionIDs[i][0] == sessionID) {
					return true;
				}
			}
			return false;
		}
		
		export function cleanSessionIDs(): void {
			var expireTime = ((new Date()).getTime() - 43200000); //Set expire time to 12 hours
			for (var i = 0; i < sessionIDs.length; i++) {
				if(sessionIDs[i][1] < expireTime) {
					sessionIDs.splice(i,1); //Remove specified Session ID, and any other Session IDs more than 12h old.
				}
			}
		}
	}
}