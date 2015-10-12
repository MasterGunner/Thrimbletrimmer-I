/// <reference path="../../typings/tsd.d.ts" />
declare module Thrimbletrimmer {
    module Constants {
        var HOSTNAME: string;
        var PORT: number;
        var USERLISTLOCATION: string;
        var LOGFOLDER: string;
        var EDITORPAGELOCATION: string;
        var VIDEOSLOCATION: string;
        var TYPE: string;
        var TITLE: string;
        var DESCRIPTION: string;
        var FRAMERATE: number;
        var WIDTH: number;
        var HEIGHT: number;
    }
}
declare var fs: any;
declare var GoogleAuth: any;
declare module Thrimbletrimmer {
    module Utilities {
        function log(message: string): void;
        function validateVideoSubmission(data: WubloaderIntegration.video): boolean;
        function loadAuthorizedUsers(): void;
        function auth(id_token: string, callback: Function): void;
        function generateSessionId(): string;
        function validateSessionId(sessionID: string): boolean;
        function cleanSessionIDs(): void;
    }
}
declare var fs: any;
declare module Thrimbletrimmer {
    module WubloaderIntegration {
        interface video {
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
        function newVideo(source: string, options: video, deleteOnSubmit: boolean, callback: Function): string;
        function getVideos(): Array<[video, Function]>;
        function getVideo(videoId: string): video;
        function submitVideo(data: video): boolean;
    }
}
declare var express: any;
declare var bodyParser: any;
declare module Thrimbletrimmer {
    module Xannathor {
        class Server {
            private app;
            constructor(hostname: string, port: number, UserListLocation: string, VideosLocation: string, LogFolder: string);
            configureServerDefaults(): void;
            configureAuth(): void;
            configureVideoFunctions(): void;
            newVideo(source: string, options: WubloaderIntegration.video, deleteOnSubmit: boolean, callback: Function): string;
        }
    }
}
