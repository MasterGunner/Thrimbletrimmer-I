/// <reference path="Utilities.ts" />
/// <reference path="Constants.ts" />

/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
module Thrimbletrimmer {
	export module WubloaderIntegration {
		var videos = []; //Array of videos ready for editing.
		
		export interface video {
			vidID?: string;
			title?: string;
			description?: string;
			startOffset?: number;
			endOffset?: number;
			source?: string;
			type?: string;
			framerate?: number;
			width?: number;
			height?: number;
			deleteOnSubmit?: boolean;
		}
		
		//Makes a new video available for access in the web interface.
		export function newVideo(source:string, options:video, deleteOnSubmit:boolean, callback:Function): string {
			if (videos.length > 5000) {
				Utilities.log('Too many videos in buffer, sorry.'); 
				return 'Too many videos in buffer, sorry.'; //If there are more than 5000 vidoes in the buffer, stop adding more. 
			}
			
			var details: video = {
				vidID:generateVideoID(),
				source:source,
				type:(options.type) ? options.type:Constants.TYPE,
				title:(options.title) ? options.title:Constants.TITLE,
				description:(options.description) ? options.description:Constants.DESCRIPTION,
				framerate:(options.framerate) ? options.framerate:Constants.FRAMERATE,
				width:(options.width) ? options.width:Constants.WIDTH,
				height:(options.height) ? options.height:Constants.HEIGHT,
				startOffset:(options.startOffset) ? options.startOffset:0,
				endOffset:(options.endOffset) ? options.endOffset:0,
				deleteOnSubmit:deleteOnSubmit
			}
			
			videos.push([details, callback]);
			return 'http://' + Constants.HOSTNAME + ((Constants.PORT == 80) ? '':(':' + Constants.PORT)) + '/Thrimbletrimmer.html?Video=' + details.vidID;
		}
		
		//Generate an ID to use in the URL and for finding a video in the array again.
		function generateVideoID(): string {
			var id = Math.floor(Math.random() * 10000).toString();
			for (var i = 0; i < videos.length; i++) {
				if (id === videos[i][0].vidID) {
					generateVideoID();
					break;
				}
			};
			return id;
		}
		
		export function getVideos(): Array<[video,Function]> {
			return videos;
		}
		
		//Get a single video from the 'Videos' array based on the generated VideoID.
		export function getVideo(videoId: string): video {
			var response = null;
			try {
				for (var i = 0; i < videos.length; i++) {
					if(videos[i][0].vidID == videoId) {
						response = videos[i][0];
						break;
					}
				}
			} catch (err) {
				Utilities.log(err);
			}
			return response;
		}
		
		//Submits requested edits to the callback function of the associated video, and removes it from the array.
		export function submitVideo(data: video): boolean {
			var successfulSubmission = false;
			if(Utilities.validateVideoSubmission(data)) {
				try {
					for (var i = 0; i < videos.length; i++) {
						if (videos[i][0].vidID == data.vidID) {
							//Remove the session ID, and add in all the parameters not provided by Eustace.
							delete data["extraMetadata[0][SessionId]"];
							data.source = videos[i][0].source;
							data.type = videos[i][0].type;
							data.framerate = videos[i][0].framerate;
							data.width = videos[i][0].width;
							data.height = videos[i][0].height;
							data.deleteOnSubmit = videos[i][0].deleteOnSubmit;
							//Initiate the callback function associated with the video.
							videos[i][1](data);
							//Removes the video from the array.
							if(videos[i][0].deleteOnSubmit) { videos.splice(i,1); }
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