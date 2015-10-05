/// <reference path="Utilities.ts" />
/// <reference path="Constants.ts" />

/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
module Xannathor {
	export module WubloaderIntegration {
		var videos = []; //Array of videos ready for editing.
		
		export function newVideo(source:string, options:any, callback:Object): string {
			var details = {
				vidID:generateID(),
				src:source,
				type:(options.type) ? options.type:Constants.TYPE,
				title:(options.title) ? options.type:Constants.TITLE,
				description:(options.description) ? options.type:Constants.DESCRIPTION,
				framerate:(options.framerate) ? options.type:Constants.FRAMERATE,
				width:(options.width) ? options.type:Constants.WIDTH,
				height:(options.height) ? options.type:Constants.HEIGHT
			}
			videos.push([details, callback]);
			
			return 'http://' + Constants.HOSTNAME + ((Constants.PORT == 80) ? '':(':' + Constants.PORT)) + '/Thrimbletrimmer.html?Video=' + details.vidID;
		}
		
		function generateID(): string {
			var id = Math.floor(Math.random() * 10000).toString();
			for (var i = 0; i < videos.length; i++) {
				if (id === videos[i][0].vidID) {
					generateID();
					break;
				}
			};
			return id;
		}
		
		export function videosList(): Array<any> {
			return videos;
		}
		
		//Get a single video from the 'Videos' array based on the generated VideoID.
		export function getVideo(videoId: string): Object {
			var response = null;
			try {
				for (var i = 0; i < videos.length; i++) {
					if(videos[i][0].vidID == videoId) {
						var video = videos[i][0];
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
		
		//Submits requested edits to the callback function of the associated video, and removes it from the array.
		export function submitVideo(data): boolean {
			var successfulSubmission = false;
			if(Utilities.validateVideoSubmission(data)) {
				try {
					for (var i = 0; i < videos.length; i++) {
						if (videos[i][0].vidID == data.vidID) {
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