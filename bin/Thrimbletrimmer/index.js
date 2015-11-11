/// <reference path="../typings/tsd.d.ts" />
var Thrimbletrimmer;
(function (Thrimbletrimmer) {
    var Constants;
    (function (Constants) {
        Constants.EDITORPAGELOCATION = __dirname + '/EditorPage';
        Constants.TYPE = "video/mp4";
        Constants.TITLE = "Desert Bus Clip";
        Constants.DESCRIPTION = "A clip from Desert Bus.";
        Constants.FRAMERATE = 30;
        Constants.WIDTH = 640;
        Constants.HEIGHT = 360;
    })(Constants = Thrimbletrimmer.Constants || (Thrimbletrimmer.Constants = {}));
})(Thrimbletrimmer || (Thrimbletrimmer = {}));
/// <reference path="../typings/tsd.d.ts" />
module.exports = Thrimbletrimmer;
/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var GoogleAuth = require('google-auth-library');
var Thrimbletrimmer;
(function (Thrimbletrimmer) {
    var Utilities;
    (function (Utilities) {
        function log(message) {
            var datetime = (new Date()).toISOString().split("T");
            message = datetime[1] + " - " + message;
            var logFile = Thrimbletrimmer.Constants.LOGFOLDER + "/" + Thrimbletrimmer.Constants.HOSTNAME + datetime[0] + ".log";
            fs.appendFile(logFile, message, function (err) { if (err)
                throw err; });
            console.log(message);
        }
        Utilities.log = log;
        function validateVideoSubmission(data) {
            var validation = [false, "Unkown Error"];
            if (data.vidID && data.startOffset && data.endOffset && data.title && data.description) {
                if (parseFloat(data.startOffset.toString()) < parseFloat(data.endOffset.toString())) {
                    if (data.title.length <= 91) {
                        return [true];
                    }
                    else {
                        validation = [false, "Failed Validation: Title longer than 91 characters"];
                    }
                }
                else {
                    validation = [false, "Failed Validation: Start greater than End."];
                }
            }
            else {
                validation = [false, "Failed Validation: Missing parameter. Require Video ID, Start, End, Title, and Description."];
            }
            Utilities.log(validation[1].toString());
            Utilities.log(JSON.stringify(data));
            return validation;
        }
        Utilities.validateVideoSubmission = validateVideoSubmission;
        Utilities.OVERRIDEAUTH = false;
        Utilities.authorizedUsers = [];
        function auth(id_token, callback) {
            var authValidation = function (err, body) {
                if (err) {
                    Utilities.log("Error Authenticating OAuth Token:");
                    Utilities.log(err);
                    callback(false, null);
                }
                else {
                    var userInfo = body.getPayload();
                    var userEmail = userInfo.email;
                    if (Utilities.authorizedUsers.indexOf(userEmail.toUpperCase()) >= 0) {
                        Utilities.log('User Authenticated: ' + userEmail);
                        callback(true, Utilities.generateSessionId());
                    }
                    else {
                        Utilities.log('User Not Authenticated: ' + userEmail);
                        callback(false, null);
                    }
                }
            };
            try {
                (new (new GoogleAuth).OAuth2).verifyIdToken(id_token, null, authValidation);
            }
            catch (err) {
                Utilities.log(err);
            }
        }
        Utilities.auth = auth;
        var sessionIDs = [];
        function generateSessionId() {
            cleanSessionIDs();
            if (sessionIDs.length > 5000) {
                sessionIDs = [];
                log("Session ID array force-cleared. Sorry.");
            }
            var sessionID = Math.floor(Math.random() * 10000).toString();
            for (var i = 0; i < sessionIDs.length; i++) {
                if (sessionID === sessionIDs[i][0]) {
                    generateSessionId();
                    break;
                }
            }
            sessionIDs.push([sessionID, (new Date()).getTime()]);
            return sessionID;
        }
        Utilities.generateSessionId = generateSessionId;
        function validateSessionId(sessionID) {
            if (Utilities.OVERRIDEAUTH) {
                return true;
            }
            for (var i = 0; i < sessionIDs.length; i++) {
                if (sessionIDs[i][0] == sessionID) {
                    return true;
                }
            }
            log("Failed to validate session key: " + sessionID);
            return false;
        }
        Utilities.validateSessionId = validateSessionId;
        function cleanSessionIDs() {
            var expireTime = ((new Date()).getTime() - 43200000);
            for (var i = 0; i < sessionIDs.length; i++) {
                if (sessionIDs[i][1] < expireTime) {
                    sessionIDs.splice(i, 1);
                }
            }
        }
        Utilities.cleanSessionIDs = cleanSessionIDs;
    })(Utilities = Thrimbletrimmer.Utilities || (Thrimbletrimmer.Utilities = {}));
})(Thrimbletrimmer || (Thrimbletrimmer = {}));
/// <reference path="Utilities.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var Thrimbletrimmer;
(function (Thrimbletrimmer) {
    var WubloaderIntegration;
    (function (WubloaderIntegration) {
        var videos = [];
        var maxGenID = 0;
        function newVideo(source, options, deleteOnSubmit, callback) {
            var details = {
                vidID: (options.vidID) ? options.vidID : (maxGenID++).toString(),
                source: source,
                type: (options.type) ? options.type : Thrimbletrimmer.Constants.TYPE,
                title: (options.title) ? options.title : Thrimbletrimmer.Constants.TITLE,
                description: (options.description) ? options.description : Thrimbletrimmer.Constants.DESCRIPTION,
                framerate: (options.framerate) ? options.framerate : Thrimbletrimmer.Constants.FRAMERATE,
                width: (options.width) ? options.width : Thrimbletrimmer.Constants.WIDTH,
                height: (options.height) ? options.height : Thrimbletrimmer.Constants.HEIGHT,
                startOffset: (options.startOffset) ? options.startOffset : 0,
                endOffset: (options.endOffset) ? options.endOffset : 0,
                deleteOnSubmit: deleteOnSubmit
            };
            videos.push([details, callback]);
            return 'http://' + Thrimbletrimmer.Constants.HOSTNAME + ((Thrimbletrimmer.Constants.PORT == 80) ? '' : (':' + Thrimbletrimmer.Constants.PORT)) + '/Thrimbletrimmer.html?Video=' + details.vidID;
        }
        WubloaderIntegration.newVideo = newVideo;
        function getVideos() {
            return videos;
        }
        WubloaderIntegration.getVideos = getVideos;
        function getVideo(videoId) {
            var response = null;
            try {
                for (var i = 0; i < videos.length; i++) {
                    if (videos[i][0].vidID == videoId) {
                        response = videos[i][0];
                        break;
                    }
                }
            }
            catch (err) {
                Thrimbletrimmer.Utilities.log(err);
            }
            return response;
        }
        WubloaderIntegration.getVideo = getVideo;
        function submitVideo(data) {
            var successfulSubmission = [false, 'Unknown Error'];
            var validation = Thrimbletrimmer.Utilities.validateVideoSubmission(data);
            if (validation[0]) {
                try {
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i][0].vidID == data.vidID) {
                            delete data["extraMetadata[0][SessionId]"];
                            data.source = videos[i][0].source;
                            data.type = videos[i][0].type;
                            data.framerate = videos[i][0].framerate;
                            data.width = videos[i][0].width;
                            data.height = videos[i][0].height;
                            data.deleteOnSubmit = videos[i][0].deleteOnSubmit;
                            videos[i][1](data);
                            if (videos[i][0].deleteOnSubmit) {
                                videos.splice(i, 1);
                            }
                            successfulSubmission = [true];
                            break;
                        }
                    }
                }
                catch (err) {
                    Thrimbletrimmer.Utilities.log(err);
                    successfulSubmission = [false, err];
                }
            }
            else {
                successfulSubmission = [false, validation[1]];
            }
            return successfulSubmission;
        }
        WubloaderIntegration.submitVideo = submitVideo;
    })(WubloaderIntegration = Thrimbletrimmer.WubloaderIntegration || (Thrimbletrimmer.WubloaderIntegration = {}));
})(Thrimbletrimmer || (Thrimbletrimmer = {}));
//Are you tired of all your packets going where you tell them?
//Why not try Dave's Discount Server, where we have top men sending packets for you!
//Watch as our trained professionals wrap up all the packets and put them in the tubes.
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="Utilities.ts" />
/// <reference path="WubloaderIntegration.ts" />
/// <reference path="Constants.ts" />
var express = require('express');
var bodyParser = require('body-parser');
var Thrimbletrimmer;
(function (Thrimbletrimmer) {
    var Xannathor;
    (function (Xannathor) {
        var Server = (function () {
            function Server(hostname, port, UserList, VideosLocation, LogFolder, APIKey, isDev) {
                if (typeof isDev === "undefined") {
                    isDev = false;
                }
                Thrimbletrimmer.Constants.HOSTNAME = hostname;
                Thrimbletrimmer.Constants.PORT = port;
                Thrimbletrimmer.Constants.VIDEOSLOCATION = VideosLocation;
                Thrimbletrimmer.Constants.LOGFOLDER = LogFolder;
                Thrimbletrimmer.Constants.APIKEY = APIKey;
                Thrimbletrimmer.Constants.ISDEV = (typeof isDev === "undefined") ? false : isDev;
                this.app = express();
                this.configureServerDefaults();
                this.configureAuth(UserList);
                this.configureVideoFunctions();
                this.app.listen(port);
                Thrimbletrimmer.Utilities.log('Server running at http://' + hostname + ':' + port);
            }
            Server.prototype.configureServerDefaults = function () {
                this.app.use(bodyParser.json());
                this.app.use(bodyParser.urlencoded({ extended: false }));
                this.app.use(express.static(Thrimbletrimmer.Constants.EDITORPAGELOCATION));
                this.app.use(express.static(Thrimbletrimmer.Constants.VIDEOSLOCATION));
                if (Thrimbletrimmer.Constants.ISDEV) {
                    this.app.get('/', function (req, res) {
                        var indexPage = '';
                        Thrimbletrimmer.WubloaderIntegration.getVideos().forEach(function (video) {
                            indexPage += '<li><a href="/Thrimbletrimmer.html?Video=' + video[0].vidID + '">' + video[0].vidID + '</a></li>';
                        });
                        indexPage = '<body><ul>' + indexPage + '</ul></body>';
                        res.type('html');
                        res.send(indexPage);
                    });
                }
            };
            Server.prototype.configureAuth = function (UserList) {
                for (var i = 0; i < UserList.length; i++) {
                    UserList[i] = UserList[i].toUpperCase();
                }
                Thrimbletrimmer.Utilities.authorizedUsers = UserList;
                this.app.post('/tokensignin', function (req, res) {
                    Thrimbletrimmer.Utilities.auth(req.body.id_token, function (isAuth, sessionId) {
                        if (isAuth) {
                            var data = { Response: 'User Authenticated', SessionId: sessionId };
                            res.json(data);
                        }
                        else {
                            var data = { Response: 'User Not Authenticated', SessionId: sessionId };
                            res.json(data);
                        }
                    });
                });
                this.app.get('/getGoogleID', function (req, res) {
                    if (Thrimbletrimmer.Utilities.OVERRIDEAUTH) {
                        res.send("AuthOverride");
                    }
                    else {
                        res.send(Thrimbletrimmer.Constants.APIKEY);
                    }
                });
            };
            Server.prototype.configureVideoFunctions = function () {
                this.app.get('/getwubs/:a?', function (req, res) {
                    if (Thrimbletrimmer.Utilities.validateSessionId(req.query.SessionId)) {
                        var videoData = Thrimbletrimmer.WubloaderIntegration.getVideo(req.params.a);
                        if (videoData) {
                            res.json(videoData);
                        }
                        else {
                            res.status(400).send('Unable to retrieve video.');
                        }
                    }
                    else {
                        res.status(401).send('Cannot validate session, please refresh and try again.');
                    }
                });
                this.app.post('/setwubs', function (req, res) {
                    Thrimbletrimmer.Utilities.log("Recieved Edit Request");
                    if (Thrimbletrimmer.Utilities.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
                        var submission = Thrimbletrimmer.WubloaderIntegration.submitVideo(req.body);
                        if (submission[0]) {
                            res.send('Received Video Edits');
                        }
                        else {
                            res.status(400).send(submission[1]);
                        }
                    }
                    else {
                        res.status(401).send('Cannot validate session. Please refresh and try again.');
                    }
                });
            };
            Server.prototype.newVideo = function (source, options, deleteOnSubmit, callback) {
                return Thrimbletrimmer.WubloaderIntegration.newVideo(source, options, deleteOnSubmit, callback);
            };
            Server.prototype.updateUserList = function (UserList) {
                Thrimbletrimmer.Utilities.OVERRIDEAUTH = (UserList.length) ? false : true;
                for (var i = 0; i < UserList.length; i++) {
                    UserList[i] = UserList[i].toUpperCase();
                }
                Thrimbletrimmer.Utilities.authorizedUsers = UserList;
            };
            Server.prototype.overrideAuth = function (override) {
                Thrimbletrimmer.Utilities.OVERRIDEAUTH = override;
            };
            return Server;
        })();
        Xannathor.Server = Server;
    })(Xannathor = Thrimbletrimmer.Xannathor || (Thrimbletrimmer.Xannathor = {}));
})(Thrimbletrimmer || (Thrimbletrimmer = {}));
