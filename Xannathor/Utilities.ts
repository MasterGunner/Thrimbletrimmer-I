/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var GoogleAuth = require('google-auth-library');

module Xannathor {
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
			return validation;
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
					var authUserList = fs.readFileSync('../Resources/AuthenticatedUserList.txt').toString().split("\n");
					if (authUserList.indexOf(userEmail) >= 0) {
						Utilities.log('User Authenticated: '+userEmail);
						callback(true, Utilities.generateSessionId(userInfo));
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
		export function generateSessionId (userInfo: any): string {
			return '1234567890';
		}
		export function validateSessionId (sessionId: string): boolean {
			return (sessionId == '1234567890') ? true:false;
		}
	}
}