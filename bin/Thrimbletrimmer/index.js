/// <reference path="../typings/tsd.d.ts" />
var Thrimbletrimmer;
(function (Thrimbletrimmer) {
    var Constants;
    (function (Constants) {
        Constants.EDITORPAGELOCATION = __dirname + '/EditorPage';
        Constants.TYPE = "video/mp4";
        Constants.TITLE = "Desert Bus Clip";
        Constants.DESCRIPTION = "A clip from Desert Bus.";
        Constants.FRAMERATE = "30";
        Constants.WIDTH = "640";
        Constants.HEIGHT = "360";
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
            console.log(message);
        }
        Utilities.log = log;
        function validateVideoSubmission(data) {
            var validation = false;
            if (data.vidID && data.start && data.end && data.title && data.description) {
                if (data.start < data.end && data.title.length <= 91) {
                    validation = true;
                }
            }
            if (!validation) {
                Utilities.log("Failed Validation");
            }
            return validation;
        }
        Utilities.validateVideoSubmission = validateVideoSubmission;
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
                    var authUserList = fs.readFileSync(Thrimbletrimmer.Constants.USERLISTLOCATION).toString().split("\n");
                    if (authUserList.indexOf(userEmail) >= 0) {
                        Utilities.log('User Authenticated: ' + userEmail);
                        callback(true, Utilities.generateSessionId(userInfo));
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
        function generateSessionId(userInfo) {
            return '1234567890';
        }
        Utilities.generateSessionId = generateSessionId;
        function validateSessionId(sessionId) {
            return (sessionId == '1234567890') ? true : false;
        }
        Utilities.validateSessionId = validateSessionId;
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
        function newVideo(source, options, callback) {
            if (options.width) {
                options.width = options.width * (options.width / 640);
                options.height = options.height * (options.width / 640);
            }
            var details = {
                vidID: generateID(),
                src: source,
                type: (options.type) ? options.type : Thrimbletrimmer.Constants.TYPE,
                title: (options.title) ? options.type : Thrimbletrimmer.Constants.TITLE,
                description: (options.description) ? options.type : Thrimbletrimmer.Constants.DESCRIPTION,
                framerate: (options.framerate) ? options.type : Thrimbletrimmer.Constants.FRAMERATE,
                width: (options.width) ? options.type : Thrimbletrimmer.Constants.WIDTH,
                height: (options.height) ? options.type : Thrimbletrimmer.Constants.HEIGHT
            };
            videos.push([details, callback]);
            return 'http://' + Thrimbletrimmer.Constants.HOSTNAME + ((Thrimbletrimmer.Constants.PORT == 80) ? '' : (':' + Thrimbletrimmer.Constants.PORT)) + '/Thrimbletrimmer.html?Video=' + details.vidID;
        }
        WubloaderIntegration.newVideo = newVideo;
        function generateID() {
            var id = Math.floor(Math.random() * 10000).toString();
            for (var i = 0; i < videos.length; i++) {
                if (id === videos[i][0].vidID) {
                    generateID();
                    break;
                }
            }
            ;
            return id;
        }
        function videosList() {
            return videos;
        }
        WubloaderIntegration.videosList = videosList;
        function getVideo(videoId) {
            var response = null;
            try {
                for (var i = 0; i < videos.length; i++) {
                    if (videos[i][0].vidID == videoId) {
                        var video = videos[i][0];
                        var data = {
                            vidID: video.vidID,
                            src: video.src,
                            type: video.type,
                            title: video.title,
                            description: video.description,
                            framerate: video.framerate,
                            width: video.width,
                            height: video.height
                        };
                        response = data;
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
            var successfulSubmission = false;
            if (Thrimbletrimmer.Utilities.validateVideoSubmission(data)) {
                try {
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i][0].vidID == data.vidID) {
                            videos[i][1](data);
                            videos.splice(i, 1);
                            successfulSubmission = true;
                            break;
                        }
                    }
                }
                catch (err) {
                    Thrimbletrimmer.Utilities.log(err);
                }
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
            function Server(hostname, port, UserListLocation, VideosLocation) {
                Thrimbletrimmer.Constants.HOSTNAME = hostname;
                Thrimbletrimmer.Constants.PORT = port;
                Thrimbletrimmer.Constants.USERLISTLOCATION = UserListLocation;
                Thrimbletrimmer.Constants.VIDEOSLOCATION = VideosLocation;
                this.app = express();
                this.configureServerDefaults();
                this.configureGoogleAuth();
                this.configureVideoFunctions();
                this.app.listen(port);
                Thrimbletrimmer.Utilities.log('Server running at http://' + hostname + ':' + port);
            }
            Server.prototype.configureServerDefaults = function () {
                this.app.use(bodyParser.json());
                this.app.use(bodyParser.urlencoded({ extended: false }));
                this.app.use(express.static(Thrimbletrimmer.Constants.EDITORPAGELOCATION));
                this.app.use(express.static(Thrimbletrimmer.Constants.VIDEOSLOCATION));
                this.app.get('/', function (req, res) {
                    var indexPage = '';
                    Thrimbletrimmer.WubloaderIntegration.videosList().forEach(function (video) {
                        indexPage += '<li><a href="/Thrimbletrimmer.html?Video=' + video[0].vidID + '">' + video[0].vidID + '</a></li>';
                    });
                    indexPage = '<body><ul>' + indexPage + '</ul></body>';
                    res.type('html');
                    res.send(indexPage);
                });
            };
            Server.prototype.configureGoogleAuth = function () {
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
            };
            Server.prototype.configureVideoFunctions = function () {
                this.app.get('/getwubs/:a?', function (req, res) {
                    if (Thrimbletrimmer.Utilities.validateSessionId(req.query.SessionId)) {
                        var videoData = Thrimbletrimmer.WubloaderIntegration.getVideo(req.params.a);
                        if (videoData) {
                            res.json(videoData);
                        }
                        else {
                            res.sendStatus(404);
                        }
                    }
                    else {
                        res.sendStatus(401);
                    }
                });
                this.app.post('/setwubs', function (req, res) {
                    Thrimbletrimmer.Utilities.log("Recieved Edit Request");
                    if (Thrimbletrimmer.Utilities.validateSessionId(req.body["extraMetadata[0][SessionId]"])) {
                        if (Thrimbletrimmer.WubloaderIntegration.submitVideo(req.body)) {
                            res.send('Recieved Video Edits');
                        }
                        else {
                            res.sendStatus(500);
                        }
                    }
                    else {
                        res.sendStatus(401);
                    }
                });
            };
            Server.prototype.newVideo = function (source, options, callback) {
                return Thrimbletrimmer.WubloaderIntegration.newVideo(source, options, callback);
            };
            return Server;
        })();
        Xannathor.Server = Server;
    })(Xannathor = Thrimbletrimmer.Xannathor || (Thrimbletrimmer.Xannathor = {}));
})(Thrimbletrimmer || (Thrimbletrimmer = {}));
