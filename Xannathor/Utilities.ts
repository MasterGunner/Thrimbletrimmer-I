/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var GoogleAuth = require('google-auth-library');

module Thrimbletrimmer {
	export module Utilities {
		//Logging
		export function log (message:string): void {
			console.log(message);
		}
		
		/*export function log (...message: any[]): void {
			console.log(message.join(" "));
		}*/
		
		//Video Input Validation
		export function validateVideoSubmission (data: any): boolean { 
			var validation = false;
			if(data.vidID && data.start && data.end && data.title && data.description) {
				if(data.start < data.end && data.title.length <= 91 ) {
					validation = true;
				}
			}
			if(!validation) { Utilities.log("Failed Validation"); }
			return validation;
		}
		
		//
		// Authentication Functions
		//
		
		//Set up Authentication
		var authorizedUsers = [];
		export function loadAuthorizedUsers(): void {
			authorizedUsers = fs.readFileSync(Constants.USERLISTLOCATION).toString().split("\n");
		}
		
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
			var expireTime = ((new Date()).getTime() - 86400000);
			for (var i = 0; i < sessionIDs.length; i++) {
				if(sessionIDs[i][1] < expireTime) {
					sessionIDs.splice(i,1); //Remove specified Session ID, and any other Session IDs more than 24h old.
				}
			}
		}
	}
}