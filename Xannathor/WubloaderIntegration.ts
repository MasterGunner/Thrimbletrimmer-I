/// <reference path="Utilities.ts" />
/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
module Xannathor {
	export module WubloaderIntegration {
		var videos = []; //Array of videos ready for editing.
		
		export function newVideo(videoID: string, callback:Object): string {
			videos.push([videoID, callback]);
			return "/Thrimbletrimmer.html?Video=" + videoID;
		}
		
		export function getVideo(videoId: string): Object {
			//Test function only. Replace with calls to the Wubloader for video information.
			var response = null;
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
							framerate:video.framerate,
							width:video.width,
							height:video.height
						};
						response = data;
						break;
					}
				}
			} catch (err) {
				Utilities.log(err);
			}
			return response;
		}
		
		export function submitVideo(data): boolean {
			var successfulSubmission = false;
			if(Utilities.validateVideoSubmission(data)) {
				try {
					for (var i = 0; i < videos.length; i++) {
						if (videos[i][0] == data.vidID) {
							videos[i][1](data);
							videos.splice(i,1);
							successfulSubmission = true;
							break;
						}
					}
				} catch (err) {
					Utilities.log(err);
				}
			}
			return successfulSubmission
		}
	}
}