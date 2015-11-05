/// <reference path="../typings/tsd.d.ts" />

module Thrimbletrimmer {
	export module Constants {
		//General
		export var HOSTNAME: string;
		export var PORT: number;
		export var LOGFOLDER: string;
		
		//Web page/resource locations
		export var EDITORPAGELOCATION = __dirname + '/EditorPage';
		export var VIDEOSLOCATION: string;
		
		//Video metadata defaults.
		export var TYPE = "video/mp4";
		export var TITLE = "Desert Bus Clip";
		export var DESCRIPTION = "A clip from Desert Bus.";
		export var FRAMERATE = 30;
		export var WIDTH = 640;
		export var HEIGHT = 360;
	}
}