/// <reference path="../typings/tsd.d.ts" />
declare module Xannathor {
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
        function getVideo(videoId: string): Object;
        function submitVideo(data: any): boolean;
    }
}
declare var express: any;
declare var bodyParser: any;
declare var Utilities: typeof Xannathor.Utilities;
declare var Wubloader: typeof Xannathor.WubloaderIntegration;
declare var app: any;
