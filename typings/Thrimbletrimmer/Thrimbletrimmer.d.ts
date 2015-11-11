/// <reference path="../../typings/tsd.d.ts" />
declare module Thrimbletrimmer {
    module Constants {
        var HOSTNAME: string;
        var PORT: number;
        var LOGFOLDER: string;
        var APIKEY: string;
        var ISDEV: boolean;
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
        function validateVideoSubmission(data: WubloaderIntegration.video): Array<any>;
        var OVERRIDEAUTH: boolean;
        var authorizedUsers: any[];
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
        function submitVideo(data: video): Array<any>;
    }
}
declare var express: any;
declare var bodyParser: any;
declare module Thrimbletrimmer {
    module Xannathor {
        class Server {
            private app;
            constructor(hostname: string, port: number, UserList: Array<string>, VideosLocation: string, LogFolder: string, APIKey: string, isDev: boolean);
            configureServerDefaults(): void;
            configureAuth(UserList: Array<string>): void;
            configureVideoFunctions(): void;
            newVideo(source: string, options: WubloaderIntegration.video, deleteOnSubmit: boolean, callback: Function): string;
            updateUserList(UserList: Array<string>): void;
            overrideAuth(override: boolean): void;
        }
    }
}
