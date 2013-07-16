// Generated by CoffeeScript 1.4.0
// Chatbot for plug.dj
/*
* @auteur : FabienRG
* Website : http://www.realitygaming.fr/
* Facebook : http://www.facebook.com/iFabiien7o
* Twitter : http://www.twitter.com/iFabiien7o
*/
// Copyright© FabienRG.

var active = "en ligne"

setTimeout(function(){ log('Chatbot est maintenant ' + active.fontcolor('lightgreen') + '. ©FabienRG.') },1000);

(function() {
  var Command, RoomHelper, User, afkCheck, afksCommand, allAfksCommand, announceCurate, antispam, apiHooks, tutoCommand, smileyCommand, sosCommand, chaineCommand, aideCommand, suggestCommand, badQualityCommand, beggar, chatCommandDispatcher, chatUniversals, cmds, data, handleNewSong, handleUserJoin, handleUserLeave, handleVote, hook, initEnvironment, initHooks, initialize, lockCommand, msToStr, populateUserData, resetAfkCommand, roomHelpCommand, rulesCommand, settings, skipCommand, statusCommand, themeCommand, undoHooks, unhook, unlockCommand, updateVotes, whyMehCommand, whyWootCommand, wootCommand,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  settings = (function() {

    function settings() {
      this.implode = __bind(this.implode, this);

      this.intervalMessages = __bind(this.intervalMessages, this);

      this.startAfkInterval = __bind(this.startAfkInterval, this);

      this.setInternalWaitlist = __bind(this.setInternalWaitlist, this);

      this.userJoin = __bind(this.userJoin, this);

      this.getRoomUrlPath = __bind(this.getRoomUrlPath, this);

      this.startup = __bind(this.startup, this);

    }

    settings.prototype.currentsong = {};

    settings.prototype.users = {};

    settings.prototype.djs = [];

    settings.prototype.mods = [];

    settings.prototype.host = [];

    settings.prototype.hasWarned = false;

    settings.prototype.currentwoots = 0;

    settings.prototype.currentmehs = 0;

    settings.prototype.currentcurates = 0;

    settings.prototype.roomUrlPath = null;

    settings.prototype.internalWaitlist = [];

    settings.prototype.userDisconnectLog = [];

    settings.prototype.voteLog = {};

    settings.prototype.seshOn = false;

    settings.prototype.forceSkip = false;

    settings.prototype.seshMembers = [];

    settings.prototype.launchTime = null;

    settings.prototype.totalVotingData = {
      woots: 0,
      mehs: 0,
      curates: 0
    };

    settings.prototype.pupScriptUrl = '';

    settings.prototype.afkTime = 60 * 60 * 1000;

    settings.prototype.songCount = 0;

    settings.prototype.startup = function() {
      this.launchTime = new Date();
      return this.roomUrlPath = this.getRoomUrlPath();
    };

    settings.prototype.getRoomUrlPath = function() {
      return window.location.pathname.replace(/\//g, '');
    };

    settings.prototype.newSong = function() {
      this.totalVotingData.woots += this.currentwoots;
      this.totalVotingData.mehs += this.currentmehs;
      this.totalVotingData.curates += this.currentcurates;
      this.setInternalWaitlist();
      this.currentsong = API.getMedia();
      if (this.currentsong !== null) {
        return this.currentsong;
      } else {
        return false;
      }
    };

    settings.prototype.userJoin = function(u) {
      var userIds, _ref;
      userIds = Object.keys(this.users);
      if (_ref = u.id, __indexOf.call(userIds, _ref) >= 0) {
        return this.users[u.id].inRoom(true);
      } else {
        this.users[u.id] = new User(u);
        return this.voteLog[u.id] = {};
      }
    };

    settings.prototype.setInternalWaitlist = function() {
      var boothWaitlist, fullWaitList, lineWaitList;
      boothWaitlist = API.getDJs().slice(1);
      lineWaitList = API.getWaitList();
      fullWaitList = boothWaitlist.concat(lineWaitList);
      return this.internalWaitlist = fullWaitList;
    };

    settings.prototype.activity = function(obj) {
      if (obj.type === 'message') {
        return this.users[obj.fromID].updateActivity();
      }
    };

    settings.prototype.startAfkInterval = function() {
      return this.afkInterval = setInterval(afkCheck, 2000);
    };

    settings.prototype.intervalMessages = function() {
      var msg, _i, _len, _ref, _results;
      this.songCount++;
      _ref = this.songIntervalMessages;
      _results = [];
      return _results;
    };

    settings.prototype.implode = function() {
      var item, val;
      for (item in this) {
        val = this[item];
        if (typeof this[item] === 'object') {
          delete this[item];
        }
      }
      return clearInterval(this.afkInterval);
    };

    settings.prototype.lockBooth = function(callback) {
      if (callback == null) {
        callback = null;
      }
      return $.ajax({
        url: "http://plug.dj/_/gateway/room.update_options",
        type: 'POST',
        data: JSON.stringify({
          service: "room.update_options",
          body: [
            this.roomUrlPath, {
              "boothLocked": true,
              "waitListEnabled": true,
              "maxPlays": 1,
              "maxDJs": 5
            }
          ]
        }),
        async: this.async,
        dataType: 'json',
        contentType: 'application/json'
      }).done(function() {
        if (callback != null) {
          return callback();
        }
      });
    };

    settings.prototype.unlockBooth = function(callback) {
      if (callback == null) {
        callback = null;
      }
      return $.ajax({
        url: "http://plug.dj/_/gateway/room.update_options",
        type: 'POST',
        data: JSON.stringify({
          service: "room.update_options",
          body: [
            this.roomUrlPath, {
              "boothLocked": false,
              "waitListEnabled": true,
              "maxPlays": 1,
              "maxDJs": 5
            }
          ]
        }),
        async: this.async,
        dataType: 'json',
        contentType: 'application/json'
      }).done(function() {
        if (callback != null) {
          return callback();
        }
      });
    };

    return settings;

  })();

  data = new settings();

  User = (function() {

    User.prototype.afkWarningCount = 0;

    User.prototype.lastWarning = null;

    User.prototype["protected"] = false;

    User.prototype.isInRoom = true;

    function User(user) {
      this.user = user;
      this.updateVote = __bind(this.updateVote, this);

      this.inRoom = __bind(this.inRoom, this);

      this.notDj = __bind(this.notDj, this);

      this.warn = __bind(this.warn, this);

      this.getIsDj = __bind(this.getIsDj, this);

      this.getWarningCount = __bind(this.getWarningCount, this);

      this.getUser = __bind(this.getUser, this);

      this.getLastWarning = __bind(this.getLastWarning, this);

      this.getLastActivity = __bind(this.getLastActivity, this);

      this.updateActivity = __bind(this.updateActivity, this);

      this.init = __bind(this.init, this);

      this.init();
    }

    User.prototype.init = function() {
      return this.lastActivity = new Date();
    };

    User.prototype.updateActivity = function() {
      this.lastActivity = new Date();
      this.afkWarningCount = 0;
      return this.lastWarning = null;
    };

    User.prototype.getLastActivity = function() {
      return this.lastActivity;
    };

    User.prototype.getLastWarning = function() {
      if (this.lastWarning === null) {
        return false;
      } else {
        return this.lastWarning;
      }
    };

    User.prototype.getUser = function() {
      return this.user;
    };

    User.prototype.getWarningCount = function() {
      return this.afkWarningCount;
    };

    User.prototype.getIsDj = function() {
      var DJs, dj, _i, _len;
      DJs = API.getDJs();
      for (_i = 0, _len = DJs.length; _i < _len; _i++) {
        dj = DJs[_i];
        if (this.user.id === dj.id) {
          return true;
        }
      }
      return false;
    };

    User.prototype.warn = function() {
      this.afkWarningCount++;
      return this.lastWarning = new Date();
    };

    User.prototype.notDj = function() {
      this.afkWarningCount = 0;
      return this.lastWarning = null;
    };

    User.prototype.inRoom = function(online) {
      return this.isInRoom = online;
    };

    User.prototype.updateVote = function(v) {
      if (this.isInRoom) {
        return data.voteLog[this.user.id][data.currentsong.id] = v;
      }
    };

    return User;

  })();

  RoomHelper = (function() {

    function RoomHelper() {}

    RoomHelper.prototype.lookupUser = function(username) {
      var id, u, _ref;
      _ref = data.users;
      for (id in _ref) {
        u = _ref[id];
        if (u.getUser().username === username) {
          return u.getUser();
        }
      }
      return false;
    };

    RoomHelper.prototype.userVoteRatio = function(user) {
      var songId, songVotes, vote, votes;
      songVotes = data.voteLog[user.id];
      votes = {
        'woot': 0,
        'meh': 0
      };
      for (songId in songVotes) {
        vote = songVotes[songId];
        if (vote === 1) {
          votes['woot']++;
        } else if (vote === -1) {
          votes['meh']++;
        }
      }
      votes['positiveRatio'] = (votes['woot'] / (votes['woot'] + votes['meh'])).toFixed(2);
      return votes;
    };

    return RoomHelper;

  })();

  populateUserData = function() {
    var u, users, _i, _len;
    users = API.getUsers();
    for (_i = 0, _len = users.length; _i < _len; _i++) {
      u = users[_i];
      data.users[u.id] = new User(u);
      data.voteLog[u.id] = {};
    }
  };

  initEnvironment = function() {
    document.getElementById("button-vote-positive").click();
    document.getElementById("button-sound").click();
    Playback.streamDisabled = true;
    return Playback.stop();
  };

  initialize = function() {
    populateUserData();
    initEnvironment();
    initHooks();
    data.startup();
    data.newSong();
    return data.startAfkInterval();
  };

  afkCheck = function() {
    var DJs, id, lastActivity, lastWarned, now, oneMinute, secsLastActive, timeSinceLastActivity, timeSinceLastWarning, twoMinutes, user, warnMsg, _ref, _results;
    _ref = data.users;
    _results = [];
    for (id in _ref) {
      user = _ref[id];
      now = new Date();
      lastActivity = user.getLastActivity();
      timeSinceLastActivity = now.getTime() - lastActivity.getTime();
      if (timeSinceLastActivity > data.afkTime) {
        if (user.getIsDj()) {
          secsLastActive = timeSinceLastActivity / 1000;
          if (user.getWarningCount() === 0) {
            user.warn();
            _results.push(API.sendChat("@" + user.getUser().username + ", vous etes maintenant inactif depuis 1 heure."));
          } else if (user.getWarningCount() === 1) {
            lastWarned = user.getLastWarning();
            timeSinceLastWarning = now.getTime() - lastWarned.getTime();
            twoMinutes = 2 * 60 * 1000;
            if (timeSinceLastWarning > twoMinutes) {
              user.warn();
              warnMsg = "@" + user.getUser().username;
              warnMsg += ", toujours inactif.. :(";
              _results.push(API.sendChat(warnMsg));
            } else {
              _results.push(void 0);
            }
          } else if (user.getWarningCount() === 2) {
            lastWarned = user.getLastWarning();
            timeSinceLastWarning = now.getTime() - lastWarned.getTime();
            oneMinute = 1 * 60 * 1000;
            if (timeSinceLastWarning > oneMinute) {
              DJs = API.getDJs();
              if (DJs.length > 0 && DJs[0].id !== user.getUser().id) {
                API.sendChat("@" + user.getUser().username + ", restez actif en distribuant des evaluations ou via le chat s'il-vous-plait.");
                API.moderateRemoveDJ(id);
                _results.push(user.warn());
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(user.notDj());
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  msToStr = function(msTime) {
    var ms, msg, timeAway;
    msg = '';
    timeAway = {
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    };
    ms = {
      'day': 24 * 60 * 60 * 1000,
      'hour': 60 * 60 * 1000,
      'minute': 60 * 1000,
      'second': 1000
    };
    if (msTime > ms['day']) {
      timeAway['days'] = Math.floor(msTime / ms['day']);
      msTime = msTime % ms['day'];
    }
    if (msTime > ms['hour']) {
      timeAway['hours'] = Math.floor(msTime / ms['hour']);
      msTime = msTime % ms['hour'];
    }
    if (msTime > ms['minute']) {
      timeAway['minutes'] = Math.floor(msTime / ms['minute']);
      msTime = msTime % ms['minute'];
    }
    if (msTime > ms['second']) {
      timeAway['seconds'] = Math.floor(msTime / ms['second']);
    }
    if (timeAway['days'] !== 0) {
      msg += timeAway['days'].toString() + 'd';
    }
    if (timeAway['hours'] !== 0) {
      msg += timeAway['hours'].toString() + 'h';
    }
    if (timeAway['minutes'] !== 0) {
      msg += timeAway['minutes'].toString() + 'm';
    }
    if (timeAway['seconds'] !== 0) {
      msg += timeAway['seconds'].toString() + 's';
    }
    if (msg !== '') {
      return msg;
    } else {
      return false;
    }
  };

  Command = (function() {

    function Command(msgData) {
      this.msgData = msgData;
      this.init();
    }

    Command.prototype.init = function() {
      this.parseType = null;
      this.command = null;
      return this.rankPrivelege = null;
    };

    Command.prototype.functionality = function(data) {};

    Command.prototype.hasPrivelege = function() {
      var user;
      user = data.users[this.msgData.fromID].getUser();
      switch (this.rankPrivelege) {
        case 'host':
          return user.permission === 5;
        case 'cohost':
          return user.permission >= 4;
        case 'mod':
          return user.permission >= 3;
        case 'manager':
          return user.permission >= 3;
        case 'bouncer':
          return user.permission >= 2;
        case 'featured':
          return user.permission >= 1;
        default:
          return true;
      }
    };

    Command.prototype.commandMatch = function() {
      var command, msg, _i, _len, _ref;
      msg = this.msgData.message;
      if (typeof this.command === 'string') {
        if (this.parseType === 'exact') {
          if (msg === this.command) {
            return true;
          } else {
            return false;
          }
        } else if (this.parseType === 'startsWith') {
          if (msg.substr(0, this.command.length) === this.command) {
            return true;
          } else {
            return false;
          }
        } else if (this.parseType === 'contains') {
          if (msg.indexOf(this.command) !== -1) {
            return true;
          } else {
            return false;
          }
        }
      } else if (typeof this.command === 'object') {
        _ref = this.command;
        return false;
      }
    };

    Command.prototype.evalMsg = function() {
      if (this.commandMatch() && this.hasPrivelege()) {
        this.functionality();
        return true;
      } else {
        return false;
      }
    };

    return Command;

  })();

  whyWootCommand = (function(_super) {

    __extends(whyWootCommand, _super);

    function whyWootCommand() {
      return whyWootCommand.__super__.constructor.apply(this, arguments);
    }

    whyWootCommand.prototype.init = function() {
      this.command = '/whywoot';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'bouncer';
    };

    whyWootCommand.prototype.functionality = function() {
      var msg, nameIndex;
      msg = "Nous n'aimons pas les DJ qui sont AFK, merci de rester actif en distribuant des evaluations ou via le chat.";
      if ((nameIndex = this.msgData.message.indexOf('@')) !== -1) {
        return API.sendChat(this.msgData.message.substr(nameIndex) + ', ' + msg);
      } else {
        return API.sendChat(msg);
      }
    };

    return whyWootCommand;

  })(Command);

  themeCommand = (function(_super) {

    __extends(themeCommand, _super);

    function themeCommand() {
      return themeCommand.__super__.constructor.apply(this, arguments);
    }

    themeCommand.prototype.init = function() {
      this.command = '/theme';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'bouncer';
    };

    themeCommand.prototype.functionality = function() {
      var msg;
      msg = "Tout type de musique est accepte, il en faut pour tout les gouts ! ";
      msg += "Dubstep, Drum&Bass, Hardstyle, Moombahton, EDM, House, Electro, Trance, etc !!";
      return API.sendChat(msg);
    };

    return themeCommand;

  })(Command);

  rulesCommand = (function(_super) {

    __extends(rulesCommand, _super);

    function rulesCommand() {
      return rulesCommand.__super__.constructor.apply(this, arguments);
    }

    rulesCommand.prototype.init = function() {
      this.command = '/rules';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'bouncer';
    };

    rulesCommand.prototype.functionality = function() {
      var msg;
      msg = "1) Les insultes, propos racistes et le flood en continue ne sont pas toleres. ";
      msg += "2) Essayez de visiter souvent l'historique en haut a gauche. Cela vous eviteras de passer la meme musique sans arret. ";
      msg += "3) Il y'en faut pour tout le monde ! C'est pour cela que nous limitons les musiques a 6 minutes maximum. ";
      msg += "4) Les trolls ne sont pas autorises : musique de 10h, pornographique, etc...";
      return API.sendChat(msg);
    };

    return rulesCommand;

  })(Command);

  roomHelpCommand = (function(_super) {

    __extends(roomHelpCommand, _super);

    function roomHelpCommand() {
      return roomHelpCommand.__super__.constructor.apply(this, arguments);
    }

    roomHelpCommand.prototype.init = function() {
      this.command = '/welcome';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'bouncer';
    };

    roomHelpCommand.prototype.functionality = function() {
      var msg1, msg2;
      msg1 = "Bienvenue sur le salon plug.dj officiel du site RealityGaming.fr ! ";
      msg1 += "Changez votre pseudo en cliquant dessus, creez une liste de lecture et ajoutez-y des musiques. ";
      msg2 = "Vous pouvez ajouter des musiques depuis YouTube et SoundCloud. ";
      msg2 += "Restez un minimum actif si vous mixez ou vous serez retire de la liste d'attente. :)";
      API.sendChat(msg1);
      return setTimeout((function() {
        return API.sendChat(msg2);
      }), 750);
    };

    return roomHelpCommand;

  })(Command);

  wootCommand = (function(_super) {

    __extends(wootCommand, _super);

    function wootCommand() {
      return wootCommand.__super__.constructor.apply(this, arguments);
    }

    wootCommand.prototype.init = function() {
      this.command = '/woot';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'bouncer';
    };

    wootCommand.prototype.functionality = function() {
      var msg, nameIndex;
      msg = "Soutenez les DJ en mettant des woots ! :thumbsup:";
      if ((nameIndex = this.msgData.message.indexOf('@')) !== -1) {
        return API.sendChat(this.msgData.message.substr(nameIndex) + ', ' + msg);
      } else {
        return API.sendChat(msg);
      }
    };

    return wootCommand;

  })(Command);

  badQualityCommand = (function(_super) {

    __extends(badQualityCommand, _super);

    function badQualityCommand() {
      return badQualityCommand.__super__.constructor.apply(this, arguments);
    }

    badQualityCommand.prototype.init = function() {
      this.command = '/bad';
      this.parseType = 'exact';
      return this.rankPrivelege = 'mod';
    };

    badQualityCommand.prototype.functionality = function() {
      var msg;
      msg = "Ou avez-vous trouve cette musique? Dans une poubelle? :trollface:";
      return API.sendChat(msg);
    };

    return badQualityCommand;

  })(Command);

  afksCommand = (function(_super) {

    __extends(afksCommand, _super);

    function afksCommand() {
      return afksCommand.__super__.constructor.apply(this, arguments);
    }

    afksCommand.prototype.init = function() {
      this.command = '/afks';
      this.parseType = 'exact';
      return this.rankPrivelege = 'mod';
    };

    afksCommand.prototype.functionality = function() {
      var dj, djAfk, djs, msg, now, _i, _len;
      msg = '';
      djs = API.getDJs();
      for (_i = 0, _len = djs.length; _i < _len; _i++) {
        dj = djs[_i];
        now = new Date();
        djAfk = now.getTime() - data.users[dj.id].getLastActivity().getTime();
        if (djAfk > (15 * 60 * 1000)) {
          if (msToStr(djAfk) !== false) {
            msg += dj.username + ' - ' + msToStr(djAfk);
            msg += '. ';
          }
        }
      }
      if (msg === '') {
        return API.sendChat("Personne n'est AFK.");
      } else {
        return API.sendChat('AFKs: ' + msg);
      }
    };

    return afksCommand;

  })(Command);

  allAfksCommand = (function(_super) {

    __extends(allAfksCommand, _super);

    function allAfksCommand() {
      return allAfksCommand.__super__.constructor.apply(this, arguments);
    }

    allAfksCommand.prototype.init = function() {
      this.command = '/allafks';
      this.parseType = 'exact';
      return this.rankPrivelege = 'mod';
    };

    allAfksCommand.prototype.functionality = function() {
      var msg, now, u, uAfk, usrs, _i, _len;
      msg = '';
      usrs = API.getUsers();
      for (_i = 0, _len = usrs.length; _i < _len; _i++) {
        u = usrs[_i];
        now = new Date();
        uAfk = now.getTime() - data.users[u.id].getLastActivity().getTime();
        if (uAfk > (30 * 60 * 1000)) {
          if (msToStr(uAfk) !== false) {
            msg += u.username + ' - ' + msToStr(uAfk);
            msg += '. ';
          }
        }
      }
      if (msg === '') {
        return API.sendChat("Personne n'est AFK.");
      } else {
        return API.sendChat('AFKs: ' + msg);
      }
    };

    return allAfksCommand;

  })(Command);

  statusCommand = (function(_super) {

    __extends(statusCommand, _super);

    function statusCommand() {
      return statusCommand.__super__.constructor.apply(this, arguments);
    }

    statusCommand.prototype.init = function() {
      this.command = '/status';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    statusCommand.prototype.functionality = function() {
      var day, hour, launch, lt, meridian, min, month, msg, t, totals;
      lt = data.launchTime;
      month = lt.getMonth() + 1;
      day = lt.getDate();
      hour = lt.getHours();
      meridian = hour % 12 === hour ? 'AM' : 'PM';
      min = lt.getMinutes();
      min = min < 10 ? '0' + min : min;
      t = data.totalVotingData;
      t['songs'] = data.songCount;
      launch = 'Initiated ' + month + '/' + day + ' ' + hour + ':' + min + ' ' + meridian + '. ';
      totals = '' + t.songs + ' chansons ont ete jouees, accumulant ' + t.woots + ' woots, ' + t.mehs + ' mehs, et ' + t.curates + ' ajouts.';
      msg = launch + totals;
      return API.sendChat(msg);
    };

    return statusCommand;

  })(Command);

  lockCommand = (function(_super) {

    __extends(lockCommand, _super);

    function lockCommand() {
      return lockCommand.__super__.constructor.apply(this, arguments);
    }

    lockCommand.prototype.init = function() {
      this.command = '/lock';
      this.parseType = 'exact';
      return this.rankPrivelege = 'mod';
    };

    lockCommand.prototype.functionality = function() {
      return data.lockBooth();
    };

    return lockCommand;

  })(Command);

  unlockCommand = (function(_super) {

    __extends(unlockCommand, _super);

    function unlockCommand() {
      return unlockCommand.__super__.constructor.apply(this, arguments);
    }

    unlockCommand.prototype.init = function() {
      this.command = '/unlock';
      this.parseType = 'exact';
      return this.rankPrivelege = 'mod';
    };

    unlockCommand.prototype.functionality = function() {
      return data.unlockBooth();
    };

    return unlockCommand;

  })(Command);

  resetAfkCommand = (function(_super) {

    __extends(resetAfkCommand, _super);

    function resetAfkCommand() {
      return resetAfkCommand.__super__.constructor.apply(this, arguments);
    }

    resetAfkCommand.prototype.init = function() {
      this.command = '/resetafk';
      this.parseType = 'startsWith';
      return this.rankPrivelege = 'mod';
    };

    resetAfkCommand.prototype.functionality = function() {
      var id, name, u, _ref;
      if (this.msgData.message.length > 10) {
        name = this.msgData.message.substring(11);
        _ref = data.users;
        for (id in _ref) {
          u = _ref[id];
          if (u.getUser().username === name) {
            u.updateActivity();
            API.sendChat('@' + u.getUser().username + '\'s Temps AFK reset.');
            return;
          }
        }
        API.sendChat('Je ne suis pas sur de qui est ' + name);
      } else {
        API.sendChat("Temps d'inactivite remis a zero.");
      }
    };

    return resetAfkCommand;

  })(Command);

  skipCommand = (function(_super) {

    __extends(skipCommand, _super);

    function skipCommand() {
      return skipCommand.__super__.constructor.apply(this, arguments);
    }

    skipCommand.prototype.init = function() {
      this.command = '/skip';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    skipCommand.prototype.functionality = function() {
      return API.moderateForceSkip();
    };

    return skipCommand;

  })(Command);

  whyMehCommand = (function(_super) {

    __extends(whyMehCommand, _super);

    function whyMehCommand() {
      return whyMehCommand.__super__.constructor.apply(this, arguments);
    }

    whyMehCommand.prototype.init = function() {
      this.command = '/whymeh';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    whyMehCommand.prototype.functionality = function() {
      var msg;
      msg = "Mehs reserves pour les chansons qui sont a) souvent jouees b) pas audibles c) chansons troll. ";
      msg += "Si vous n'etes pas emballe par une chanson, ne votez pas.";
      return API.sendChat(msg);
    };

    return whyMehCommand;

  })(Command);
  
    tutoCommand = (function(_super) {

    __extends(tutoCommand, _super);

    function tutoCommand() {
      return tutoCommand.__super__.constructor.apply(this, arguments);
    }

    tutoCommand.prototype.init = function() {
      this.command = '/tuto';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    tutoCommand.prototype.functionality = function() {
      var msg;
      msg = "Voici un tutoriel par @Eric71 concernant le fonctionnement de plug.dj ";
      msg += "ainsi que les avantages, les concepts, les regles a respecter et un ";
      msg += "mini guide pour bien debuter : http://realitygaming.fr/threads/157380/ :information_source:";
      return API.sendChat(msg);
    };

    return tutoCommand;

  })(Command);
  
    smileyCommand = (function(_super) {

    __extends(smileyCommand, _super);

    function smileyCommand() {
      return smileyCommand.__super__.constructor.apply(this, arguments);
    }

    smileyCommand.prototype.init = function() {
      this.command = '/smiley';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    smileyCommand.prototype.functionality = function() {
      var msg;
      msg = "Voici une page recapitulative de tout les smileys ";
      msg += "presents sur le site plug.dj : http://www.emoji-cheat-sheet.com/ :information_source:";
      return API.sendChat(msg);
    };

    return smileyCommand;

  })(Command);
  
      sosCommand = (function(_super) {

    __extends(sosCommand, _super);

    function sosCommand() {
      return sosCommand.__super__.constructor.apply(this, arguments);
    }

    sosCommand.prototype.init = function() {
      this.command = '/sos';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    sosCommand.prototype.functionality = function() {
      var msg;
      msg = "Vous rencontrez un probleme ? ";
      msg += "Contactez nous sur notre site web : http://realitygaming.fr/ :sos:";
      return API.sendChat(msg);
    };

    return sosCommand;

  })(Command);
  
        suggestCommand = (function(_super) {

    __extends(suggestCommand, _super);

    function suggestCommand() {
      return suggestCommand.__super__.constructor.apply(this, arguments);
    }

    suggestCommand.prototype.init = function() {
      this.command = '/suggest';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    suggestCommand.prototype.functionality = function() {
      var msg;
      msg = "Des suggestions a propos du salon ? ";
      msg += "Contactez nous sur notre site web : http://realitygaming.fr/ :warning:";
      return API.sendChat(msg);
    };

    return suggestCommand;

  })(Command);
  
        aideCommand = (function(_super) {

    __extends(aideCommand, _super);

    function aideCommand() {
      return aideCommand.__super__.constructor.apply(this, arguments);
    }

    aideCommand.prototype.init = function() {
      this.command = '/cmd';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    aideCommand.prototype.functionality = function() {
      var msg;
      msg = "Voici les commandes disponibles pour le staff : ";
      msg += "/lock, /unlock, /skip, /bad, /resetafk, /afks, /allafks, /suggest, ";
    msg += "/welcome, /rules, /theme, /tuto, /smiley, /woot, /whywoot, /whymeh, ";
	  msg += "/sos, /status, /chaine, /cmd :no_entry:";
      API.sendChat(msg);
    };

    return aideCommand;
	
	  })(Command);
  
        chaineCommand = (function(_super) {

    __extends(chaineCommand, _super);

    function chaineCommand() {
      return chaineCommand.__super__.constructor.apply(this, arguments);
    }

    chaineCommand.prototype.init = function() {
      this.command = '/chaine';
      this.parseType = 'exact';
      return this.rankPrivelege = 'bouncer';
    };

    chaineCommand.prototype.functionality = function() {
      var msg;
      msg = "Tu ne sais pas quoi diffuser comme contenu? ";
      msg += "Viens faire un tour sur le post d'@Eric71 qui regroupe un grand nombre de chaîne :";
    msg += " http://realitygaming.fr/threads/168001/ :sound:";
      API.sendChat(msg);
    };

    return chaineCommand;
  
  cmds = [suggestCommand, chaineCommand, aideCommand, sosCommand, smileyCommand, tutoCommand, whyWootCommand, themeCommand, rulesCommand, roomHelpCommand, wootCommand, badQualityCommand, afksCommand, allAfksCommand, statusCommand, lockCommand, unlockCommand, whyMehCommand, skipCommand, resetAfkCommand];

  chatCommandDispatcher = function(chat) {
    var c, cmd, _i, _len, _results;
    chatUniversals(chat);
    _results = [];
    for (_i = 0, _len = cmds.length; _i < _len; _i++) {
      cmd = cmds[_i];
      c = new cmd(chat);
      if (c.evalMsg()) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  updateVotes = function(obj) {
    data.currentwoots = obj.positive;
    data.currentmehs = obj.negative;
    return data.currentcurates = obj.curates;
  };

  handleNewSong = function(obj) {
    var songId;
    data.intervalMessages();
    if (data.currentsong === null) {
      data.newSong();
    } else {
      API.sendChat("/em: " + data.currentsong.title + " par " + data.currentsong.author + ". Stats: :thumbsup: " + data.currentwoots + ", :thumbsdown: " + data.currentmehs + ", <3 " + data.currentcurates + ".");
      data.newSong();
      document.getElementById("button-vote-positive").click();
    }
    if (data.forceSkip) {
      songId = obj.media.id;
      return setTimeout(function() {
        var cMedia;
        cMedia = API.getMedia();
        if (cMedia.id === songId) {
          return API.moderateForceSkip();
        }
      }, obj.media.duration * 1000);
    }
  };

  handleVote = function(obj) {
    data.users[obj.user.id].updateActivity();
    return data.users[obj.user.id].updateVote(obj.vote);
  };

  handleUserLeave = function(user) {
    var disconnectStats, i, u, _i, _len, _ref;
    disconnectStats = {
      id: user.id,
      time: new Date(),
      songCount: data.songCount
    };
    i = 0;
    _ref = data.internalWaitlist;
    data.userDisconnectLog.push(disconnectStats);
    return data.users[user.id].inRoom(false);
  };

  antispam = function(chat) {
    var plugRoomLinkPatt, sender;
    plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if (plugRoomLinkPatt.exec(chat.message)) {
      sender = API.getUser(chat.fromID);
      if (!sender.ambassador && !sender.moderator && !sender.owner && !sender.superuser) {
        if (!data.users[chat.fromID]["protected"]) {
          API.sendChat("Ne spam pas le salon de lien comme ça.");
          return API.moderateDeleteChat(chat.chatID);
        } else {
          return API.sendChat("Je suis suppose te chasser, mais tu es tellement beau..");
        }
      }
    }
  };

  beggar = function(chat) {
    var msg, r, responses;
    msg = chat.message.toLowerCase();
    responses = ["Bonne idee @{beggar}!  Les fans ne tombent pas du ciel. ;)", "Les gars ! @{beggar} vient de demander pour avoir des fans, on le fait ?! :trollface:", "Serieux @{beggar}...", "@{beggar}. Diffuse du bon contenu et soit aimable avec les personnes presentes pour obtenir des fans de facon legit ! :trollface:"];
    r = Math.floor(Math.random() * responses.length);
    if (msg.indexOf('fan me') !== -1 || msg.indexOf('fan for fan') !== -1 || msg.indexOf('fan pls') !== -1 || msg.indexOf('fan4fan') !== -1 || msg.indexOf('fan stp') !== -1 || msg.indexOf('je veux des fans') !== -1 || msg.indexOf('fan moi') !== -1 || msg.indexOf('deviens fan') !== -1 || msg.indexOf('add me to fan') !== -1) {
      return API.sendChat(responses[r].replace("{beggar}", chat.from));
    }
  };

  chatUniversals = function(chat) {
    data.activity(chat);
    antispam(chat);
    return beggar(chat);
  };
  
    beggar = function(chat) {
    var msg, r, responses;
    msg = chat.message.toLowerCase();
    responses = ["/me give un whisky coca à @{beggar} ! :cocktail:", "/me offre une Desperados bien fraiche à @{beggar}. :beer:", "/me propose à @{beggar} de boire du kiddibulle, car il a l'air fort ce petit. :baby_bottle:", "/me donne du Jack Daniel's à @{beggar}, fais-en bon usage. :hammer:", "/me est généreux et offre une bière à tout le monde ! :beers:", "/me offre un Coca sans bulles à @{beggar}. :trollface:"];
    r = Math.floor(Math.random() * responses.length);
    if (msg.indexOf('/give') !== -1) {
      return API.sendChat(responses[r].replace("{beggar}", chat.from));
    }
  };
  
    chatUniversals = function(chat) {
    data.activity(chat);
    antispam(chat);
    return beggar(chat);
  };

  hook = function(apiEvent, callback) {
    return API.addEventListener(apiEvent, callback);
  };

  unhook = function(apiEvent, callback) {
    return API.removeEventListener(apiEvent, callback);
  };

  apiHooks = [
    {
      'event': API.ROOM_SCORE_UPDATE,
      'callback': updateVotes
    }, {
      'event': API.CURATE_UPDATE,
      'callback': announceCurate
    }, {
      'event': API.USER_JOIN,
      'callback': handleUserJoin
    }, {
      'event': API.DJ_ADVANCE,
      'callback': handleNewSong
    }, {
      'event': API.VOTE_UPDATE,
      'callback': handleVote
    }, {
      'event': API.CHAT,
      'callback': chatCommandDispatcher
    }, {
      'event': API.USER_LEAVE,
      'callback': handleUserLeave
    }
  ];

  initHooks = function() {
    var pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      pair = apiHooks[_i];
      _results.push(hook(pair['event'], pair['callback']));
    }
    return _results;
  };

  undoHooks = function() {
    var pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = apiHooks.length; _i < _len; _i++) {
      pair = apiHooks[_i];
      _results.push(unhook(pair['event'], pair['callback']));
    }
    return _results;
  };

  initialize();

}).call(this);
