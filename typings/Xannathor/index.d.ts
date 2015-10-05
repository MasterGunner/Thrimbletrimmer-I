/// <reference path="../../typings/tsd.d.ts" />
declare module Xannathor {
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
declare module Xannathor {
    module Utilities {
        function log(message: string): void;
        function validateVideoSubmission(data: any): boolean;
        function auth(id_token: string, callback: Function): void;
        function generateSessionId(userInfo: any): string;
        function validateSessionId(sessionId: string): boolean;
    }
}
declare var fs: any;
declare module Xannathor {
    module WubloaderIntegration {
        function newVideo(source: string, options: any, callback: Object): string;
        function videosList(): Array<any>;
        function getVideo(videoId: string): Object;
        function submitVideo(data: any): boolean;
    }
}
declare var express: any;
declare var bodyParser: any;
declare module Xannathor {
    module Xannathor {
        class Server {
            private app;
            constructor(hostname: string, port: number, UserListLocation: string, VideosLocation: string);
            configureServerDefaults(): void;
            configureGoogleAuth(): void;
            configureVideoFunctions(): void;
            newVideo(source: string, options: any, callback: Object): string;
        }
    }
}
