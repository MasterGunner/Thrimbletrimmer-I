/// <reference path="../../typings/tsd.d.ts" />
declare module Thrimbletrimmer {
    module Constants {
        var HOSTNAME: string;
        var PORT: number;
        var EDITORPAGELOCATION: string;
        var VIDEOSLOCATION: string;
        var USERLISTLOCATION: string;
        var TYPE: string;
        var TITLE: string;
        var DESCRIPTION: string;
        var FRAMERATE: string;
        var WIDTH: string;
        var HEIGHT: string;
    }
}
declare var fs: any;
declare var GoogleAuth: any;
declare module Thrimbletrimmer {
    module Utilities {
        function log(message: string): void;
        function validateVideoSubmission(data: any): boolean;
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
        function newVideo(source: string, options: any, deleteOnSubmit: boolean, callback: Object): string;
        function getVideos(): Array<any>;
        function getVideo(videoId: string): Object;
        function submitVideo(data: any): boolean;
    }
}
declare var express: any;
declare var bodyParser: any;
declare module Thrimbletrimmer {
    module Xannathor {
        class Server {
            private app;
            constructor(hostname: string, port: number, UserListLocation: string, VideosLocation: string);
            configureServerDefaults(): void;
            configureAuth(): void;
            configureVideoFunctions(): void;
            newVideo(source: string, options: any, deleteOnSubmit: boolean, callback: Object): string;
        }
    }
}
