/*
* @author : FabienRG
* @helper: Moky (autochange)
* @design : Conner Davis (css)
* @website : http://www.realitygaming.fr/
*/
 
var active = "activé"

setTimeout(function(){ log('Plugbot est maintenant ' + active.fontcolor('lightgreen') + '. Version 1.1') },1000);

var autowoot;
var autoqueue;
var autoskip;
var autochange;
var hideVideo;
var userList;
var strobe;
var skippingVideo = false;
var hideVideoTemp = false;
var COOKIE_WOOT = 'autowoot';
var COOKIE_QUEUE = 'autoqueue';
var COOKIE_HIDE_VIDEO = 'hidevideo';
var COOKIE_USERLIST = 'userlist';
var MAX_USERS_WAITLIST = 50;

function initAPIListeners()
{
        API.addEventListener(API.DJ_ADVANCE, djAdvanced);
        API.addEventListener(API.WAIT_LIST_UPDATE, queueUpdate);
        API.addEventListener(API.DJ_UPDATE, queueUpdate);
        API.addEventListener(API.VOTE_UPDATE, function (obj)
        {
                if (userList)
                {
                        populateUserlist();
                }
        });

        API.addEventListener(API.USER_JOIN, function (user)
        {
                if (userList)
                {
                        populateUserlist();
                }
        });

        API.addEventListener(API.USER_LEAVE, function (user)
        {
                if (userList)
                {
                        populateUserlist();
                }
        });
}
 
function displayUI()
{
        $('#plugbot-ui').remove();
        $('#chat').prepend('<div id="plugbot-ui"></div>');
 
        var cWoot = autowoot ? '#3FFF00' : '#ED1C24';
        var cMeh = (!autowoot) ? '#3FFF00' : '#ED1C24';
        var cQueue = autoqueue ? '#3FFF00' : '#ED1C24';;
        var cHideVideo = hideVideo ? '#3FFF00' : '#ED1C24';
        var cUserList = userList ? '#3FFF00' : '#ED1C24';
		var cStrobe = strobe ? '#d1d1d1' : '#d1d1d1' ;
  	
        $('#plugbot-ui').append(
                '<center><p id="plugbot-btn-woot" style="color:' + cWoot +
				'">auto-woot</p><p id="plugbot-btn-meh" style="color:' + cMeh +
				'">auto-meh</p><p id="plugbot-btn-queue" style="color:' + cQueue + 
				'">auto-queue</p><p id="plugbot-btn-hidevideo" style="color:' + cHideVideo + 
				'">hide video</p><p id="plugbot-btn-skipvideo" style="color:#ED1C24">skip video</p>' +
				'<p id="plugbot-btn-userlist" style="color:' + cUserList + '">userlist</p></center>');		
 
		$('#now-playing-header').prepend('<div id="plugbot-ui0"></div>');
		
		var cSkip = autoskip ? '#42A5DC' : '#42A5DC' ;
		
		$('#plugbot-ui0').append(
				'<center><p id="plugbot-btn-skip" style="color:' + cSkip + '">AUTOSKIP (STAFF UNIQUEMENT)</p></center>');
 
 		$('#dj-booth').prepend('<div id="plugbot-ui1"></div>');
		
		var cChange = autochange ? '#42A5DC' : '#42A5DC' ;
		
        $('#plugbot-ui1').append(
				'<center><p id="plugbot-btn-change" style="color:' + cChange + 
				'">AUTOCHANGE</p></center>');
		
		$('#dj-booth').prepend('<div id="plugbot-ui2"></div>');
		
		var cHall01 = halloween01 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween01 ;
				
		$('#plugbot-ui2').append(
				'<center><p id="plugbot-btn-halloween01" style="color:' + cHall01 + 
				'">01</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui3"></div>');

		var cHall02 = halloween02 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween02 ;
				
		$('#plugbot-ui3').append(
				'<center><p id="plugbot-btn-halloween02" style="color:' + cHall02 + 
				'">02</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui4"></div>');
				
		var cHall03 = halloween03 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween03 ;
				
		$('#plugbot-ui4').append(
				'<center><p id="plugbot-btn-halloween03" style="color:' + cHall03 + 
				'">03</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui5"></div>');
				
		var cHall04 = halloween04 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween04 ;
				
		$('#plugbot-ui5').append(
				'<center><p id="plugbot-btn-halloween04" style="color:' + cHall04 + 
				'">04</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui6"></div>');
				
		var cHall05 = halloween05 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween05 ;
				
		$('#plugbot-ui6').append(
				'<center><p id="plugbot-btn-halloween05" style="color:' + cHall05 + 
				'">05</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui7"></div>');
				
		var cHall06 = halloween06 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween06 ;
				
		$('#plugbot-ui7').append(
				'<center><p id="plugbot-btn-halloween06" style="color:' + cHall06 + 
				'">06</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui8"></div>');
				
		var cHall07 = halloween07 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween07 ;
				
		$('#plugbot-ui8').append(
				'<center><p id="plugbot-btn-halloween07" style="color:' + cHall07 + 
				'">07</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui9"></div>');
				
		var cHall08 = halloween08 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween08 ;
				
		$('#plugbot-ui9').append(
				'<center><p id="plugbot-btn-halloween08" style="color:' + cHall08 + 
				'">08</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui10"></div>');
				
		var cHall09 = halloween09 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween09 ;
				
		$('#plugbot-ui10').append(
				'<center><p id="plugbot-btn-halloween09" style="color:' + cHall09 + 
				'">09</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui11"></div>');
				
		var cHall10 = halloween10 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween10 ;
				
		$('#plugbot-ui11').append(
				'<center><p id="plugbot-btn-halloween10" style="color:' + cHall10 + 
				'">10</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui12"></div>');
				
		var cHall11 = halloween11 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween11 ;
				
		$('#plugbot-ui12').append(
				'<center><p id="plugbot-btn-halloween11" style="color:' + cHall11 + 
				'">11</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui13"></div>');
				
		var cHall12 = halloween12 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween12 ;
				
		$('#plugbot-ui13').append(
				'<center><p id="plugbot-btn-halloween12" style="color:' + cHall12 + 
				'">12</p></center>');
				
		$('#dj-booth').prepend('<div id="plugbot-ui14"></div>');
				
		var cHall13 = halloween13 ? '#d1d1d1' : '#d1d1d1' ;
		var halloween13 ;
				
		$('#plugbot-ui14').append(
				'<center><p id="plugbot-btn-halloween13" style="color:' + cHall13 + 
				'">13</p></center>');
				
}

function initUIListeners()
{

        $('#plugbot-btn-userlist').live("click", function()
        {
                userList = !userList;
                $(this).css('color', userList ? '#3FFF00' : '#ED1C24');
                $('#plugbot-userlist').css('visibility', userList ? 'visible' : 'hidden');
 
                if (!userList)
                {
                        $('#plugbot-userlist').empty();
                }
                else
                {
                        populateUserlist();
                }
                jaaulde.utils.cookies.set(COOKIE_USERLIST, userList);
        });

        $('#plugbot-btn-woot').live('click', function()
        {
                autowoot = !autowoot;
                $(this).css('color', autowoot ? '#3FFF00' : '#ED1C24');
                $('#plugbot-btn-meh').css('color', (!autowoot) ? '#3FFF00' : '#ED1C24');
 
                if (autowoot)
                {
                        $('#button-vote-positive').click();
                } else {
                        $('#button-vote-negative').click();
                }
 
                jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
        });

        $('#plugbot-btn-meh').live('click', function()
        {
                autowoot = !autowoot;
                $(this).css('color', (!autowoot) ? '#3FFF00' : '#ED1C24');
                $('#plugbot-btn-woot').css('color', autowoot ? '#3FFF00' : '#ED1C24');
 
                if ( !autowoot)
                {
                        $('#button-vote-negative').click();
                } else {
                        $('#button-vote-positive').click();
                }
				
				API.sendChat("/em vient d'activer l'auto-meh! :loudspeaker:");
 
                jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
        });
		
		        $('#plugbot-btn-skip').live('click', function()
        {				
				{
				setTimeout(function(){ return API.moderateForceSkip();
				});
					return setInterval(function(){ return API.moderateForceSkip();
				}, 15000);
				};
 
        });

				$('#plugbot-btn-change').live('click', function()
        {
				
var avatarStrobe = {
	on: true
	, speed: 500
	, interval: null
	, avatars: []
	, stop: function() {
		clearInterval(avatarStrobe.interval);
	}
	, start: function(speed) {
		avatarStrobe.stop();

		for(var i = 1; i <= 13; i++) {
			avatarStrobe.avatars.push('halloween' + (i <= 9 ? '0' : '') + i);
		}
		
		$('#avatar-panel img').each(function() { 
			var src = $(this).attr('src');
			var srcParts = src.split('/');
			var fileName = srcParts[srcParts.length-1];
			var nameParts = fileName.split('.');
			var avatarName = nameParts[0];
			
			avatarStrobe.avatars.push(avatarName); 
		});

		avatarStrobe.interval = setInterval(function() {
			if(!avatarStrobe.on) return;
			
			if(avatarStrobe.avatars.length == 0) {
				console.log('unable to load avatars. stopping.');
				avatarStrobe.stop();
			}
			
			var index = Math.floor(Math.random() * avatarStrobe.avatars.length);
			var avatar = avatarStrobe.avatars[index];

			if(avatar) {
				Models.user.changeAvatar(avatar);
			}
			else {
				console.log('derp! index=' + index)
			}
		}, speed || avatarStrobe.speed);
	}
};
avatarStrobe.start();
 
        });

        $('#plugbot-btn-hidevideo').live('click', function()
        {
                hideVideo = !hideVideo;
                $(this).css('color', hideVideo ? '#3FFF00' : '#ED1C24');
        $(this).text(hideVideo ? 'hiding video' : 'hide video');
                $('#yt-frame').animate(
                {
                        'height': (hideVideo ? '0px' : '271px')
                },
                {
                        duration: 'fast'
                });
                $('#playback .frame-background').animate(
                {
                        'opacity': (hideVideo ? '0' : '0.91')
                },
                {
                        duration: 'medium'
                });
                jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo);
        });

        $('#plugbot-btn-skipvideo').live('click', function()
        {
                skippingVideo = !skippingVideo;
                $(this).css('color', skippingVideo ? '#3FFF00' : '#ED1C24');
                $(this).text(skippingVideo ? 'skipping video' : 'skip video');

                var soundOn = (0 != $('#slider > div').width());
                if (soundOn == skippingVideo) {
                        $('#button-sound').click();
                }
 
                var intervalCheckResumeSound = null;
                if (skippingVideo) {
                        if (!hideVideoTemp && !hideVideo) { 
                                $('#plugbot-btn-hidevideo').click();
                        }
 
                        intervalCheckResumeSound = setInterval(function() {
                                if ('00:01' == $('#time-remaining-value').text() ||
                                        '00:00' == $('#time-remaining-value').text()) {
 
                                        if (skippingVideo) {
                                                if (0 == $('#slider > div').width()) {
                                                        $('#button-sound').click();
                                                }
                                        }
 
                                        clearInterval(intervalCheckResumeSound);
                                }
                        }, 500);
 
                        hideVideoTemp = true;
                } else {
                        if (hideVideoTemp && hideVideo) {
                                $('#plugbot-btn-hidevideo').click();
                        }
 
                        clearInterval(intervalCheckResumeSound);
 
                        hideVideoTemp = false;
                }
 
        });

        $('#plugbot-btn-queue').live('click', function()
        {
                autoqueue = !autoqueue;
                $(this).css('color', autoqueue ? '#3FFF00' : '#ED1C24');
 
                if (autoqueue && !isInQueue())
                {
                        joinQueue();
                }
                jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
        });

        $('.plugbot-userlist-user').live('click', function() {
                var pos = $(this).position();
                var user = $(this).text();
                var user_id = 0;
 
                for (var i = 0; i < Models.room.data.users.length; ++i) {
                        if (Models.room.data.users[i].username == user) {
                                user_id = Models.room.data.users[i].id;
                                break;
                        }
                }
 
                var user_obj = Models.room.userHash[user_id] || Models.room.nirUserHash[user_id];
                RoomUser.rollover.showChat(user_obj, pos.left + 300, pos.top);
        });
		
		$('#plugbot-btn-halloween01').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween01");
        });
		
		$('#plugbot-btn-halloween02').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween02");
        });
		
		$('#plugbot-btn-halloween03').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween03");
        });
		
		$('#plugbot-btn-halloween04').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween04");
        });
		
		$('#plugbot-btn-halloween05').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween05");
        });
		
		$('#plugbot-btn-halloween06').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween06");
        });
		
		$('#plugbot-btn-halloween07').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween07");
        });
		
		$('#plugbot-btn-halloween08').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween08");
        });
		
		$('#plugbot-btn-halloween09').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween09");
        });
		
		$('#plugbot-btn-halloween10').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween10");
        });
		
		$('#plugbot-btn-halloween11').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween11");
        });
		
		$('#plugbot-btn-halloween12').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween12");
        });
		
		$('#plugbot-btn-halloween13').live('click', function()
        {		
		javascript:Models.user.changeAvatar("halloween13");
        });
		
}

function djAdvanced(obj)
{
        if (hideVideo &&
                !skippingVideo)
        {
                $('#yt-frame').css('height', '0px');
                $('#playback .frame-background').css('opacity', '.0');
        }
 
        if (skippingVideo)
        {
                $('#plugbot-btn-skipvideo').css('color', '#ED1C24').text('skip video');
 
                if (hideVideoTemp && hideVideo) {
                        $('#plugbot-btn-hidevideo').click();
                }
 
                if (0 == $('#slider > div').width()) {
                        $('#button-sound').click();
                }
 
                skippingVideo = false;
                hideVideoTemp = false;
        }
 
        if (autowoot)
        {
                $('#button-vote-positive').click();
        } else {
                $('#button-vote-negative').click();
        }

        if (userList)
        {
                populateUserlist();
        }

}

function queueUpdate()
{
        if (autoqueue && !isInQueue())
        {
                joinQueue();
        }
}

function isInQueue()
{
        var self = API.getSelf();
        return API.getWaitList().indexOf(self) !== -1 || API.getDJs().indexOf(self) !== -1;
}

function joinQueue()
{
        if ($('#button-dj-play').css('display') === 'block')
        {
                $('#button-dj-play').click();
        }
        else if (API.getWaitList().length < MAX_USERS_WAITLIST)
        {
                API.waitListJoin();
        }
}

function populateUserlist()
{

        $('#plugbot-userlist').html(' ');

        $('#plugbot-userlist').append('<h1 style="text-indent:12px;color:#42A5DC;font-size:14px;font-variant:small-caps;">Utilisateurs: ' + API.getUsers().length + '</h1>');

        $('#plugbot-userlist').append('<p style="padding-left:12px;text-indent:0px !important;font-style:italic;color:#42A5DC;font-size:11px;">Plugbot codé par FabienRG!<br />http://realitygaming.fr/</p><br />');

        if ($('#button-dj-waitlist-view').attr('title') !== '')
        {
                if ($('#button-dj-waitlist-leave').css('display') === 'block' &&
                        ($.inArray(API.getDJs(), API.getSelf()) == -1)) {
                        var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
                        spot = spot.substring(0, spot.indexOf(')'));
                        $('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps">Waitlist:</span> ' + spot + '</h1><br />');
                }
        }

        var users = new Array();

        for (user in API.getUsers())
        {
                users.push(API.getUsers()[user]);
        }

        for (user in users)
        {
                var user = users[user];
                appendUser(user);
        }
}
 
function appendUser(user)
{
        var username = user.username;
        var permission = user.permission;
 
        if (user.admin)
        {
                permission = 99;
        }
 
        var imagePrefix;
        switch (permission)
        {
                case 0:
                        imagePrefix = 'normal';
                        break;
                case 1:
                        imagePrefix = 'featured';
                        break;
                case 2:
                        imagePrefix = 'bouncer';
                        break;
                case 3:
                        imagePrefix = 'manager';
                        break;
                case 4:
                case 5:
                        imagePrefix = 'host';
                        break;
                case 99:
                        imagePrefix = 'admin';
                        break;
        }
 
        if (API.getDJs() [0].username == username)
        {
                if (imagePrefix === 'normal')
                {
                        drawUserlistItem('void', '#42A5DC', username);
                }
                else
                {
                        drawUserlistItem(imagePrefix + '_current.png', '#42A5DC', username);
                }
        }
        else if (imagePrefix === 'normal')
        {
                drawUserlistItem('void', colorByVote(user.vote), username);
        }
        else
        {
                drawUserlistItem(imagePrefix + imagePrefixByVote(user.vote), colorByVote(user.vote), username);
        }
}
 
function colorByVote(vote)
{
        if (!vote)
        {
                return '#fff'; 
        }
        switch (vote)
        {
                case -1:       
                        return '#c8303d';
                case 0: 
                        return '#fff';
                case 1: 
                        return '#c2e320';
        }
}
 
function imagePrefixByVote(vote)
{
        if (!vote)
        {
                return '_undecided.png'; 
        }
        switch (vote)
        {
                case -1:
                        return '_meh.png';
                case 0:
                        return '_undecided.png';
                case 1:
                        return '_woot.png';
        }
}

function drawUserlistItem(imagePath, color, username)
{
        if (imagePath !== 'void')
        {
                var realPath = 'http://www.theedmbasement.com/basebot/userlist/' + imagePath;
                $('#plugbot-userlist').append('<img src="' + realPath + '" align="left" style="margin-left:6px;margin-top:2px" />');
        }
 
        $('#plugbot-userlist').append(
                '<p class="plugbot-userlist-user" style="cursor:pointer;' + (imagePath === 'void' ? '' : 'text-indent:6px !important;') + 'color:' + color + ';' + ((API.getDJs()[0].username == username) ? 'font-size:15px;font-weight:bold;' : '') + '" >' + username + '</p>');
}
 
$('#plugbot-userlist').remove();
$('#plugbot-css').remove();
$('#plugbot-js').remove();
 
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://cookies.googlecode.com/svn/trunk/jaaulde.cookies.js';
script.onreadystatechange = function()
{
        if (this.readyState == 'complete')
        {
                readCookies();
        }
}
script.onload = readCookies;
head.appendChild(script);
 
function readCookies()
{
        var currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1); 
        var newOptions =
        {
                expiresAt: currentDate
        }
        jaaulde.utils.cookies.setOptions(newOptions);
 
        var value = jaaulde.utils.cookies.get(COOKIE_WOOT);
        autowoot = value != null ? value : true;
 
        value = jaaulde.utils.cookies.get(COOKIE_QUEUE);
        autoqueue = value != null ? value : false;
 
        value = jaaulde.utils.cookies.get(COOKIE_HIDE_VIDEO);
        hideVideo = value != null ? value : false;
 
        value = jaaulde.utils.cookies.get(COOKIE_USERLIST);
        userList = value != null ? value : true;
 
        onCookiesLoaded();
}

$('body').prepend('<style type="text/css" id="plugbot-css">#plugbot-ui { position: absolute; margin-left: 349px; }#plugbot-ui p { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; padding-right: 6px;  font-variant: small-caps; cursor:pointer; width: 84px; font-size: 15px; margin: 0; }#plugbot-ui h2 { background-color: #0b0b0b; height: 112px; width: 156px; margin: 0; color: #fff; font-size: 13px; font-variant: small-caps; padding: 8px 0 0 12px; border-top: 1px dotted #292929; }#plugbot-userlist { border: 6px solid rgba(10, 10, 10, 0.8); border-left: 0 !important; background-color: #000000; padding: 8px 0px 20px 0px;width: 12%; }#plugbot-userlist p { margin: 0; padding-top: 4px; text-indent: 24px; font-size: 10px; }#plugbot-userlist p:first-child { padding-top: 0px !important; }#plugbot-queuespot { color: #42A5DC; text-align: left; font-size: 15px; margin-left: 8px }');
$('body').prepend('<style type="text/css" id="plugbot-css0">#plugbot-ui0 { position: absolute; margin-left: 95px; margin-top: -7px; cursor:pointer; font-family:Helvetica,Arial,sans-serif; font-weight: bold; font-size: 10px; }');
$('body').prepend('<style type="text/css" id="plugbot-css1">#plugbot-ui1 { position: absolute; margin-left: 885px; cursor:pointer; font-size: 12px; }');
$('body').prepend('<style type="text/css" id="plugbot-css2">#plugbot-ui2 { position: absolute; margin-left: 978px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css3">#plugbot-ui3 { position: absolute; margin-left: 995px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css4">#plugbot-ui4 { position: absolute; margin-left: 1012px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css5">#plugbot-ui5 { position: absolute; margin-left: 1029px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css6">#plugbot-ui6 { position: absolute; margin-left: 1046px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css7">#plugbot-ui7 { position: absolute; margin-left: 1063px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css8">#plugbot-ui8 { position: absolute; margin-left: 1080px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css9">#plugbot-ui9 { position: absolute; margin-left: 1097px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css10">#plugbot-ui10 { position: absolute; margin-left: 1114px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css11">#plugbot-ui11 { position: absolute; margin-left: 1131px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css12">#plugbot-ui12 { position: absolute; margin-left: 1148px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css13">#plugbot-ui13 { position: absolute; margin-left: 1165px; cursor:pointer; }');
$('body').prepend('<style type="text/css" id="plugbot-css14">#plugbot-ui14 { position: absolute; margin-left: 1182px; cursor:pointer; }');
$('body').append('<div id="plugbot-userlist"></div>');
 
function onCookiesLoaded()
{
        if (autowoot)
        {
                $('#button-vote-positive').click();
        } else {
                $('#button-vote-negative').click();
        }
 
        if (autoqueue && !isInQueue())
        {
                joinQueue();
        }
 
        if (hideVideo)
        {
                $('#yt-frame').animate(
                {
                        'height': (hideVideo ? '0px' : '271px')
                },
                {
                        duration: 'fast'
                });
                $('#playback .frame-background').animate(
                {
                        'opacity': (hideVideo ? '0' : '0.91')
                },
                {
                        duration: 'medium'
                });
        }
 
        if (userList)
        {
                populateUserlist();
        }
 
        suppressAlert();
 
        initAPIListeners();
        displayUI();
        initUIListeners();
}

function suppressAlert() {
        window.alert = function(text) {
                console.log('ALERT ' + text);
        }
}
