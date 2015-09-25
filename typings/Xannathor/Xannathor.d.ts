declare module Xannathor {
}
declare module Xannathor {
	module Utilities {
		function log (message: string): void;
		function validateVideoSubmission(data: any): boolean;
		function auth(id_token: string, callback: Function): void;
		function generateSessionId(userInfo: any): string;
		function validateSessionId (sessionId: string): boolean;
	}
}
declare module Xannathor {
	module WubloaderIntegration {
		function getVideo(videoId: string): any;
		function submitVideo(data: any): boolean;
	}
}