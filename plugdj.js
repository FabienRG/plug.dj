/*
* @author : FabienRG
* @helper : OriginNRG
* @website : http://www.realitygaming.fr/
*/

setTimeout(function() {

var version = "Script en provenance de RealityGaming.fr activé !";
var version2 = "Merci d'éviter d'abuser des fonctions de celui-ci.";
var version3 = ".";
var changeLog = "©FabienRG";
appendToChat(version, null, "#00E1FF");
appendToChat(version2, null, "#09FF00");
appendToChat(version3, null, "#FFFF00");

if(localStorage.getItem("realityg") !== "yes"){
    realitygOptions = {};
    realitygOptions.autoWoot = true;
    realitygOptions.autoJoin = true;
    realitygOptions.autoRespond = false;
    realitygOptions.userlist = true;
    realitygOptions.hideVideo = false;
    realitygOptions.alerts = true;
    realitygOptions.stream = true;
    realitygOptions.menu = true;
    realitygOptions.debug = false;
    realitygOptions.strobe = false;
    realitygOptions.lights = false;
    realitygOptions.awayMessage = "";
}

realityg = {};
realityg.mehcount = 0;
realityg.recent = false;
realityg.recentEmotes = false;

var recent = false,
    awaymsg = "",
    autowoot = true,
    autoqueue = true,
    hideVideo = false,
    userList = true,
    autorespond = false,
    recentEmote = false,
    animation = true,
    menu = true,
    alerts = true,
    strobe = false,
    debug = false,
    lights = false;
    if (DB.settings.streamDisabled = false) {
        var streambuttoncolor = "#78E700";
        var stream = true;
    }else{
        var streambuttoncolor = "#ED1C24";
        var stream = false;
    }

function initAPIListeners()
{
    API.addEventListener(API.DJ_ADVANCE, djAdvanced);
    API.addEventListener(API.VOTE_UPDATE, function(obj) {
        if(debug){
            console.log("[realityg] MAJ des votes utilisateurs...");
        }
        if (API.getUser(obj.user.id).vote == -1)
            API.getUser(obj.user.id).mehcount++;
        if(debug){
            console.log("[realityg] Ajout du compteur de 'meh' aux utilisateurs...");
        }
        if (userList)
            populateUserlist();
        if(debug){
            console.log("[realityg] Peuplement de l'userlist...");
        }
    });
    API.addEventListener(API.CURATE_UPDATE, function(obj) {
        if (alerts) {
            var media = API.getMedia();
            log(obj.user.username + " a ajouté " + media.author + " - " + media.title);
            API.getUser(obj.user.id).curated=true;
            if (userList)
                populateUserlist();
            if(debug){
                console.log("[realityg] Peuplement de l'userlist...");
            }
        }
    });
    API.addEventListener(API.USER_JOIN, function(user) {
        if (alerts){
            appendToChat(user.username + " a rejoint le salon", null, "#E90E82");
            if(debug){
                console.log("[realityg] Affichage d'alerte activé");
            }
        }
        if(API.getUser(user.id).mehcount===undefined){
            API.getUser(user.id).mehcount=0
        }
        if (userList)
            populateUserlist();
        if(debug){
            console.log("[realityg] Peuplement de l'userlist...");
        }
    });
    API.addEventListener(API.USER_LEAVE, function(user) {
        if (alerts){
            appendToChat(user.username + " a quitté le salon", null, "#E90E82");
        }
        if (userList)
            populateUserlist();
        if(debug){
            console.log("[realityg] Peuplement de l'userlist...");
        }
    });
    API.addEventListener(API.DJ_ADVANCE, function(){
        if(strobe){
            $("#strobe-menu").click();
            strobe = false;
        }
        if(lights){
            $("#lights-menu").click();
            lights = false;
        }
    });
	if (typeof API != "undefined") {
	
	console.log(API.getSelf());
	console.log("Chat modérateur prêt");
	
	API.addEventListener(API.CHAT, chatMod);
	
	function chatMod(msg) {
		if(/adf.ly/i.test(msg.message)) {
			API.moderateDeleteChat(msg.chatID);
			console.log(msg);
		}
		if(/shukbob.net/i.test(msg.message)) {
			API.moderateDeleteChat(msg.chatID);
			console.log(msg);
		}
	  }
    }
    API.addEventListener(API.CHAT, disable);
}





function displayUI(data) {

    if (Models.room.data.staff[API.getSelf().id] >= Models.user.BOUNCER) {
        $('#user-container').prepend('<div id="plugbot-ui"></div>');
        $('#plugbot-ui').append(
				'<div id="plugbot-links" style="min-width: 120px; max-height: 98.6%; overflow-x: hidden; overflow-y: auto; position: fixed; z-index: 99; border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.5); border-right: 0 !important; padding: 0px 0px 12px 0px;">' +
				
            	'<p id="plugbot-btn-menu" style="color:#FF0066; "><b>realityg</b></p>' +
                '<div style="width: 100%; visibility:visible">' +
                '<p id="plugbot-btn-woot" style="color:#78E700">AutoWoot</p>' +
				'<p id="plugbot-btn-queue" style="color:#78E700">AutoJoin</p>' +
                '<p id="plugbot-btn-hidevideo" style="color:#78E700">Hide Video</p>' +
				'<p id="plugbot-btn-autorespond" style="color:#78E700">AutoRespond</p>' +
                '<p id="plugbot-btn-userlist" style="color:#78E700">Userlist</p>' +
                '<p id="plugbot-btn-animationoff" style="color:#78E700">Animation</p>' +
                '<p id="plugbot-btn-stream" style="color:streambuttoncolor">Stream</p>' +
                '<p id="plugbot-btn-alerts" style="color:#78E700">Alerts</p>' +
				'</div>' +
				
				'<div id="plugbot-links2">' +
				'<p id="plugbot-btn-menu2" style="color:#FF0066; margin-top:20px;"><b>Sponsor</b></p>' +
				'<div style="width: 100%; visibility:visible">' +
				'<p id="plugbot-btn-realitygwebsite" style="color:#FFA400;">Website</p>' +
				'<p id="plugbot-btn-facebook" style="color:#FFA400;">Facebook</p>' +
				'<p id="plugbot-btn-twitter" style="color:#FFA400">Twitter</p>' +
				'<p id="plugbot-btn-youtube" style="color:#FFA400">YouTube</p>' +
				'</div>' +
				
				'<p id="plugbot-btn-menu3" style="color:#FF0066; margin-top:20px;"><b>Help</b></p>' +
				'<div style="width: 100%; visibility:visible">' +
				'<p id="plugbot-btn-welcome" style="color:#3F92D2;">Welcome</p>' +
				'<p id="plugbot-btn-rulesall" style="color:#3F92D2;">Rules</p>' +
				'<p id="plugbot-btn-justwoot" style="color:#3F92D2;">WOOT</p>' +
				'</div>' +
				
				'<p id="plugbot-btn-menu5" style="color:#FF0066; margin-top:20px;"><b>Commands</b></p>' +
				'<div style="width: 100%; visibility:visible">' +
				'<p id="plugbot-btn-lock" style="color:#ED1C24;">Lock</p>' +
				'<p id="plugbot-btn-unlock" style="color:#ED1C24">Unlock</p>' +
				'<p id="plugbot-btn-skip" style="color:#ED1C24">Skip</p>' +
				'<p id="plugbot-btn-lockskip" style="color:#ED1C24">Lock-Skip</p>' +
				'<p id="plugbot-btn-skiphistory" style="color:#ED1C24">History</p>' +
				'<p id="plugbot-btn-clearchat" style="color:#ED1C24">Clear Chat</p>' +
				'<p id="plugbot-btn-cap1" style="color:#ED1C24">Cap Min</p>' +
				'<p id="plugbot-btn-cap200" style="color:#ED1C24">Cap Max</p>' +
                '</div>' +
				
				'<p id="plugbot-btn-menu6" style="color:#FFFFFF; margin-top:20px;"><b>Other</b></p>' +
				'<div style="width: 100%; visibility:visible">' +
				'<p id="plugbot-btn-aboutplug" style="color:#FFFFFF">About Script</p>' +
                '</div>' +
                '</div>' +
				'</div>' 
        );
    }else{
        $('#user-container').prepend('<div id="plugbot-ui"></div>');
        $('#plugbot-ui').append(
            '<p id="plugbot-btn-menu" style="color:#E90E82 ">realityg</p>' +
                '<div style="width: 100%; visibility:visible">' +
                '<p id="plugbot-btn-woot" style="color:#78E700">Autowoot</p>' +
                '<p id="plugbot-btn-queue" style="color:#ED1C24">Autojoin</p>' +
                '<p id="plugbot-btn-userlist" style="color:#78E700">Userlist</p>' +
                '<p id="plugbot-btn-animationoff" style="color:#78E700">Animation</p>' +
                '<p id="plugbot-btn-stream" style="color:streambuttoncolor">Stream</p>' +
                '<p id="plugbot-btn-alerts" style="color:#ED1C24">Alerts</p>' +
                '</div>'
        );
    }
    $('#dj-console').prepend('<div id="strobe"></div>');
    $('#strobe').append(
        '<p id="strobe-menu">Strobe</p>' +
            '<p id="lights-menu">Lights</p>' +
            '</div>'
    );
	
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
    $("#strobe-menu") .hover(function(){
            $(this).css("border-style", "ridge");
            $(this).css("font-weight", "900");
        },
        function(){
            $(this).css("border-style", "solid");
            $(this).css("font-weight", "normal");
        });
    $("#lights-menu") .hover(function(){
            $(this).css("border-style", "ridge");
            $(this).css("font-weight", "900");
        },
        function(){
            $(this).css("border-style", "solid");
            $(this).css("font-weight", "normal");
        });
    $("#plugbot-btn-menu") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu7") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-ocommands") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-realitygwebsite") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-oeta") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-olock") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-ounlock") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-cap1") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-cap200") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-clearchat") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-aboutplug") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-links") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-justwoot") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu2") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu3") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu4") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu5") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-menu6") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-woot") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-queue") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-hidevideo") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-userlist") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-autorespond") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-animationoff") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-stream") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#plugbot-btn-alerts") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-facebook") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-twitter") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-youtube") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-changename") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-addplaylist") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-wootad") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-welcome") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-youdj") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-themes") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-lock") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-unlock") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-skip") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-lockskip") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-submissions") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-aboutplug") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
		$("#plugbot-btn-rulesall") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-ruleswoot") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-ruleseng") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-rulesnospam") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-rules10mins") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-rulesemme") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
	$("#plugbot-btn-ruleshistory") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.5)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.5)");
        });
    $("#strobe-menu").on("click", function() {
        $(this).css("color", !strobe ? "#00FFDE" : "#3B3B3B");
        $(this).css("border-color", !strobe ? "#00FFDE" : "#3B3B3B");
        $("#lights-menu").css("border-color", "#00FFDE");
        $("#lights-menu").css("color", "#00FFDE");
        if(!strobe){
            if(lights){
                $("#lights-menu").click();
            }
            RoomUser.audience.strobeMode(true);
            updateChat("","Strobe activé!");
            strobe = true;
        }else{
            RoomUser.audience.strobeMode(false);
            strobe = false;
        }
    });
    $("#lights-menu").on("click", function() {
        $(this).css("color", !lights ? "#00FFDE" : "#3B3B3B");
        $(this).css("border-color", !lights ? "#00FFDE" : "#3B3B3B");
        $("#strobe-menu").css("border-color", "#00FFDE");
        $("#strobe-menu").css("color", "#00FFDE");
        if(!lights){
            if(strobe){
                $("#strobe-menu").click();
            }
            RoomUser.audience.lightsOut(true);
            updateChat("","Lights activé !");
            lights = true;
        }else{
            RoomUser.audience.lightsOut(false);
            lights = false;
        }
    });
    $("#plugbot-btn-userlist").on("click", function() {
        userList = !userList;
        $(this).css("color", userList ? "#78E700" : "#ED1C24");
        $("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
        $("#plugbot-userlist").css("overflow", userList ? ("auto") : ("hidden"));
        if (!userList)
            $("#plugbot-userlist").empty();
        else
            populateUserlist();
    });
    $("#plugbot-btn-woot").on("click", function() {
        autowoot = !autowoot;
        $(this).css("color", autowoot ? "#78E700" : "#ED1C24");
        if (autowoot) $("#button-vote-positive").click();
    });
    $("#plugbot-btn-hidevideo").on("click", function() {
        hideVideo = !hideVideo;
        $(this).css("color", hideVideo ? "#78E700" : "#ED1C24");
        $("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
    });
    $("#plugbot-btn-queue").on("click", function() {
        autoqueue = !autoqueue;
        $(this).css("color", autoqueue ? "#78E700" : "#ED1C24");
        $("#button-dj-waitlist-" + (autoqueue ? "join" : "leave")).click();
    });
    $("#plugbot-btn-autorespond").on("click", function() {
        autorespond = !autorespond;
        $(this).css("color", autorespond ? "#78E700" : "#ED1C24");
        if (!autorespond) {
            API.removeEventListener(API.CHAT,chat);
        } else {
            awaymsg = prompt("Le message que vous entrez ici sera envoyé si quelqu'un parle de vous.\nAjoutez /user/ au début de votre message afk si vous voulez répondre à la personne qui vous parle.","/me ");
            if(awaymsg != null){
                !autorespond;
                $("#plugbot-btn-autorespond").css("color", autorespond, "#ED1C24");
                API.addEventListener(API.CHAT,chat);
            }
        }
    });
    $("#plugbot-btn-animationoff").on("click", function() {
        animation = !animation;
        $(this).css("color", !animation ? "#ED1C24" : "#78E700");
        if (!animation) {
            animSpeed = 999999999;
        } else {
            animSpeed = 83;
        }
    });
    $("#plugbot-btn-stream").on("click", function() {
        stream = !stream;
        $(this).css("color", !stream ? "#78E700" : "#ED1C24");
        if(stream){
            API.sendChat("/stream off");
        }else{
            API.sendChat("/stream on");
        }
    });
    $("#plugbot-btn-alerts").on("click", function() {
        $(this).css("color", !alerts ? "#78E700" : "#ED1C24");
        if(alerts){
            API.sendChat("/alertsoff");
        }else{
            API.sendChat("/alertson");
        }
    });
	$("#plugbot-btn-skiphistory").on("click", function() {
        Models.chat.sendChat("/history");
    });
	$("#plugbot-btn-welcome").on("click", function() {
        Models.chat.sendChat("/em - Bienvenue sur le salon plug.dj officiel du site RealityGaming.fr !");
    });
	$("#plugbot-btn-clearchat").on("click", function() {
        Models.chat.sendChat("/clear");
    });
	$("#plugbot-btn-cap1").on("click", function() {
        Models.chat.sendChat("/cap 1");
    });
	$("#plugbot-btn-cap200").on("click", function() {
        Models.chat.sendChat("/cap 200");
    });
	$("#plugbot-btn-facebook").on("click", function() {
        Models.chat.sendChat("/em - Suivez-nous sur Facebook : http://facebook.com/RealityGamingFR");
    });
	$("#plugbot-btn-twitter").on("click", function() {
        Models.chat.sendChat("/em - Suivez-nous sur Twitter : http://twitter.com/RealityGamingFR");
    });
	$("#plugbot-btn-youtube").on("click", function() {
        Models.chat.sendChat("/em - Abonnez-vous à notre chaîne YouTube : http://youtube.com/GlitchsHacksFR");
    });
	$("#plugbot-btn-justwoot").on("click", function() {
        Models.chat.sendChat("/em - WOOT!");
    });
	$("#plugbot-btn-rulesall").on("click", function() {
        setTimeout(function(){
                Models.chat.sendChat("/em - Règles realityg !");
            }, 100);
		setTimeout(function(){
                Models.chat.sendChat("/em - 1. Les insultes, propos racistes et le flood en continue ne sont pas tolérés. ");
            }, 1100);
		setTimeout(function(){
                Models.chat.sendChat("/em - 2. Essayez de visiter souvent l'historique en haut à gauche. Cela vous évitera de passer la même musique sans arrêt.");
            }, 2100);
		setTimeout(function(){
                Models.chat.sendChat("/em - 3. Il y'en faut pour tout le monde ! C'est pour cela que nous limitons les musiques à 7 minutes 30 maximum.");
            }, 3100);
		setTimeout(function(){
                Models.chat.sendChat("/em - 4. Les trolls ne sont pas autorisés : musique de 10h, pornographie, etc...");
            }, 4100);
		setTimeout(function(){
                Models.chat.sendChat("/em - 5. L'utilisation abusive de script est proscrite.");
            }, 5100);
    });
	$("#plugbot-btn-realitygwebsite").on("click", function() {
        Models.chat.sendChat("/em - Visitez notre site web ! - http://realitygaming.fr/");
    });
	$("#plugbot-btn-oeta").on("click", function() {
        Models.chat.sendChat("/eta");
    });
	$("#plugbot-btn-olock").on("click", function() {
        Models.chat.sendChat("/olock");
    });
	$("#plugbot-btn-ounlock").on("click", function() {
        Models.chat.sendChat("/ounlock");
    });
	$("#plugbot-btn-lock").on("click", function() {
        if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,true,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            return true;
        }else{
            modChat("","Vous n'avez pas le permission de faire cela.");
            return true;
        }
    });
	$("#plugbot-btn-unlock").on("click", function() {
       	 if (Models.room.data.staff[API.getSelf().id] > 2){
       	     new RoomPropsService(Slug,false,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
       	     return true;
      	  }else{
      	      modChat("","Vous n'avez pas le permission de faire cela.");
      	      return true;
     	   }
    });
	$("#plugbot-btn-skip").on("click", function() {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            new ModerationForceSkipService();
            return true;
        }else{
            modChat("","Vous n'avez pas le permission de faire cela.");
            return true;
        }
    });
	$("#plugbot-btn-lockskip").on("click", function() {
        if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,true,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            setTimeout(function(){
                new ModerationForceSkipService();
            }, 100);
            setTimeout(function(){
                new RoomPropsService(Slug,false,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            },300);
            return true;
        }else{
            modChat("", "Vous n'avez pas le permission de faire cela.");
            return true;
        }
    });
	$("#plugbot-btn-aboutplug").on("click", function() {
        alert("realityg Plug BETA 0.5.5 (Juillet 2013)\n\n@author : FabienRG\n@helper : OriginNRG\n@website : http://RealityGaming.fr/");
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
	
}

function addGlobalStyle(css){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if(!head){
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
{
    addGlobalStyle('#button-chat-collapse, #button-chat-collapse {background: url(http://i.imgur.com/jqbkAOH.png);');
    addGlobalStyle('#button-chat-expand, #button-chat-expand {background: url(http://i.imgur.com/6dFswPF.png);');
    addGlobalStyle('#chat, #chat {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#playback, #playback {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#meta-frame, #meta-frame {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#user-container, #user-container {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#meta-frame, #meta-frame {width: 349px;}');
    addGlobalStyle('.frame-background, .frame-background {opacity: 0.83;}');
	addGlobalStyle('#room-wheel, #room-wheel {background-image: max-height:0px;max-width:0px;}');
	addGlobalStyle('#dj-console, #dj-console {background-image: url(http://i.imgur.com/IpyhanS.gif);min-height:33px;min-width:131px;}');
	//addGlobalStyle('html{background: url("") no-repeat scroll center top #424242;');
    addGlobalStyle('.chat-from-featureddj, .chat-from-featureddj {color: #00B8FF !important;}');
    addGlobalStyle('.chat-from-manager, .chat-from-manager {color: #04BD04 !important;}');
    addGlobalStyle('.chat-from-cohost, .chat-from-cohost {color: #C807D1 !important;}');
    addGlobalStyle('.chat-from-host, .chat-from-host {color: #7B00FF !important;}');
    addGlobalStyle('.chat-host, .chat-host {background-image: url(http://i.imgur.com/zSFh9Kv.png); no repeat 0 5px);}');
    addGlobalStyle('.chat-cohost, .chat-cohost {background-image: url(http://i.imgur.com/zSFh9Kv.png); no repeat 0 5px;}');
    addGlobalStyle('.chat-manager, .chat-manager {background-image: url(http://i.imgur.com/ClBhjpm.png); no repeat 0 5px;}');
	addGlobalStyle('.chat-bouncer, .chat-bouncer {background-image: url(http://i.imgur.com/AmyqdG9.png); no repeat 0 5px;}');
    addGlobalStyle('.chat-message:nth-child(2n), .chat-message:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
    addGlobalStyle('.chat-update:nth-child(2n), .chat-update:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
    addGlobalStyle('.chat-mention:nth-child(1n), .chat-mention:nth-child(1n) {background-color: rgba(82, 0, 255, 0.12);}');
    addGlobalStyle('.chat-moderation:nth-child(1n), .chat-moderation:nth-child(1n) {background-color: rgba(255, 0, 0, 0.09);}');
    addGlobalStyle('.chat-skip:nth-child(1n), .chat-skip:nth-child(1n) {background-color: rgba(255, 0, 0, 0.09);}');
    addGlobalStyle('.chat-emote:nth-child(2n), .chat-emote:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
}

var words = {
"realityg Music Network" : "realityg Staff Script 0.5.5",
"When you DJ you will play..." : "Up Next...",
"Â©2012 Plug DJ, LLC." : "Â©2013 realityg",
"Points" : "Points",
"Now Playing" : "Now Playing",
"Time Remaining" : "Time Remaining",
"Volume" : "Volume",
"Current DJ" : "Current DJ",
"Crowd Response" : "Crowd Response",
"Fans":"Fans"};

String.prototype.prepareRegex = function() {
return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
return (",pre,blockquote,code,input,button,textarea".indexOf(","+tag) == -1);
}

var regexs=new Array(),
	replacements=new Array();
for(var word in words) {
if(word != "") {
regexs.push(new RegExp("\\b"+word.prepareRegex().replace(/\*/g,'[^ ]*')+"\\b", 'gi'));
replacements.push(words[word]);
}
}

var texts = document.evaluate(".//text()[normalize-space(.)!='']",document.body,null,6,null), text="";
for(var i=0,l=texts.snapshotLength; (this_text=texts.snapshotItem(i)); i++) {
	if(isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text=this_text.textContent)) {
	for(var x=0,l=regexs.length; x<l; x++) {
	text = text.replace(regexs[x], replacements[x]);
	this_text.textContent = text;
	}
	}
}

function djAdvanced(obj) {
    setTimeout(function() {
        if (hideVideo) {
            $("#yt-frame").css("height", "0px");
            $("#playback .playback-container").css("opacity", "0.0");
        }
        if (autowoot) {
            var dj = API.getDJs()[0];
            if (dj === null) return;
            if (dj == API.getSelf()) return;
            $('#button-vote-positive').click();
        }
        if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
            $("#button-dj-waitlist-join").click();
    },100);
    if (userList)
        populateUserlist();
}

function populateUserlist()
{

    $('#plugbot-userlist').html(' ');
    $('#plugbot-userlist').append('<h1 style="text-indent:12px;color:#E90E82;font-size:14px;font-variant:small-caps;">Users: ' + API.getUsers().length + '</h1>');
    if ($('#button-dj-waitlist-view').attr('title') !== '') {
        if ($('#button-dj-waitlist-leave').css('display') === 'block' && ($.inArray(API.getDJs(), API.getSelf()) == -1)) {
            var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
            spot = spot.substring(0, spot.indexOf(')'));
            $('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps;color:#E90E82;">Waitlist: ' + spot + '</span>');
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
    if (user.admin) {
        permission = 99;
    }
    var imagePrefix;
    switch (permission) {
        case 0:        
            imagePrefix = 'normal'
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
    if (API.getDJs()[0].username == username) {
        if (imagePrefix === 'normal') {
            drawUserlistItem('void', '#42A5DC', username);
        } else {
            drawUserlistItem(imagePrefix + '_current.png', '#42A5DC', username);
        }
    } else if (imagePrefix === 'normal') {
        drawUserlistItem('void', colorByVote(user.vote), username);
    } else {
        drawUserlistItem(imagePrefix + imagePrefixByVote(user.vote), colorByVote(user.vote), username);
    }
}
function colorByVote(vote) {
    if (!vote)	{
        return '#DDDDDD'; 
    }
    switch (vote) {
        case -1: 	return '#F43636';
        case 0:		return '#DDDDDD';
        case 1:		return '#95F436';
    }
}
function imagePrefixByVote(vote) {
    if (!vote) {
        return '_undecided.png'; 
    }
    switch (vote) {
        case -1:	return '_meh.png';
        case 0:		return '_undecided.png';
        case 1:		return '_woot.png';
    }
}
function drawUserlistItem(imagePath, color, username) {
    if (imagePath !== 'void') {
        var realPath = 'http://www.theedmbasement.com/basebot/userlist/' + imagePath;
        $('#plugbot-userlist').append('<img src="' + realPath + '" align="left" style="margin-left:6px; position: absolute; margin-top: .3%;" />');
    }
    $('#plugbot-userlist').append(
			 '<p style="cursor:pointer;' + (imagePath === 'void' ? '' : 'text-indent:24px !important;')
            + 'color:' + color + ';'
            + ((API.getDJs()[0].username == username) ? 'font-size:12px;font-weight:bold;' : '')
            + '">'
			+ '<a onclick="javascript:Models.chat.sendChat(\'@' + username + ' Lâchez des évaluations svp !\');">'
		    + '<img src="http://i.imgur.com/tb8qHjT.png"></a> '
			+ ' <a style="color:' + color + ';" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + username + ' \').focus();">' + username + '</a> '
			+ ' </p>'
    );
}

/*AppendToChat*/
function appendToChat(message, from, color){
    style = "";
    if (color) style = 'style="color:' + color + ';"';
    if (from)
        div = $('<div class="chat-message"><span class="chat-from" ' + style + '>' + from + '</span><span class="chat-text" ' + style + '>: ' + message + '</span></div>')[0];
    else
        div = $('<div class="chat-message"><span class="chat-text" ' + style + ' >' + message + '</span></div>')[0];
    scroll = false;
    if ($("#chat-messages")[0].scrollHeight - $("#chat-messages").scrollTop() == $("#chat-messages").outerHeight())
        scroll = true;
    var curChatDiv = Popout ? Popout.Chat.chatMessages : Chat.chatMessages;
    var s = curChatDiv.scrollTop()>curChatDiv[0].scrollHeight-curChatDiv.height()-20;
    curChatDiv.append(div);
    if (s)
        curChatDiv.scrollTop(curChatDiv[0].scrollHeight);
}
/*Different chat message types*/
var systemChat = function(from, message){
    Models.chat.receive({
        type: "system",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var messageChat = function(from, message){
    Models.chat.receive({
        type: "message",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var emoteChat = function(from, message){
    Models.chat.receive({
        type: "emote",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var modChat = function(from, message){
    Models.chat.receive({
        type: "moderation",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var mentionChat = function(from, message){
    Models.chat.receive({
        type: "mention",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var skipChat = function(from, message){
    Models.chat.receive({
        type: "skip",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var updateChat = function(from, message){
    Models.chat.receive({
        type: "update",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var customChatCommand = function(value) {
    if (Models.chat._chatCommand(value) === true)
        return true;
    if (value.indexOf("/cmd") === 0) {
        appendToChat("<center><strong>User Commands -</strong></center><br>" +
            "<strong>'/change'</strong> - <em>displays the changelog for this version</em><br>" +
            "<strong>'/deltab'</strong> - <em>Deletes the P.P userlist tab</em><br>" +
            "<strong>'/nick'</strong> - <em>change username</em>" +
            "<strong>'/avail'</strong> - <em>set status available</em><br>" +
            "<strong>'/afk'</strong> - <em>set status afk</em><br>" +
            "<strong>'/work'</strong> - <em>set status working</em><br>" +
            "<strong>'/sleep'</strong> - <em>set status sleeping</em><br>" +
            "<strong>'/join'</strong> - <em>joins dj booth/waitlist</em><br>" +
            "<strong>'/leave'</strong> - <em>leaves dj booth/waitlist</em><br>" +
            "<strong>'/strobe'</strong> - <em>toggles the strobe (for you only)</em><br>" +
            "<strong>'/lights'</strong> - <em>toggles the lights (for you only)</em><br>" +
            "<strong>'/woot'</strong> - <em>woots current song</em><br>" +
            "<strong>'/meh'</strong> - <em>mehs current song</em><br>" +
            "<strong>'/curate'</strong> - <em>adds the current song to your active playlist</em><br>" +
            "<strong>'/emotes'</strong> - <em>prints the commands for chat responses</em><br>" +
            "<strong>'/fan @(username)'</strong> - <em>fans the targeted user</em><br>" +
            "<strong>'/unfan @(username)'</strong> - <em>unfans the targeted user</em><br>" +
            "<strong>'/hide'</strong> - <em>hides the video without muting the sound</em><br>" +
            "<strong>'/ref'</strong> - <em>refreshes the video/soundcloud</em><br>" +
            "<strong>'/alertsoff'</strong> - <em>turns curate notices and user join/leave messages off</em><br>" +
            "<strong>'/alertson'</strong> - <em>turns curate notices and user join/leave messages on</em><br>" +
            "<strong>'/edit on'</strong> - <em>Turns on editing mode, it will allow you to edit mostly anything on the page</em><br>" +
            "<strong>'/edit off'</strong> - <em>Turns off editing mode</em><br>" +
            "<strong>'/getpos'</strong> - <em>get current waitlist position</em><br>" +
            "<strong>'/version'</strong> - <em>displays version number</em><br>", null, "#F700FA");
        if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
            appendToChat("<center><strong>Moderation Commands -</strong></center><br>" +
                "<strong>'/skip'</strong> - <em>skips current song</em><br>" +
                "<strong>'/kick @(username)'</strong> - <em>kicks targeted user</em><br>" +
                "<strong>'/add @(username)'</strong> - <em>adds targeted user to dj booth/waitlist</em><br>" +
                "<strong>'/remove @(username)'</strong> - <em>removes targeted user from dj booth/waitlist</em><br>" +
                "<strong>'/whois @(username)'</strong> - <em>gives general information about user</em><br>", null, "#FF0000");
            if(Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 2) {
                appendToChat("<strong>'/lock'</strong> - <em>locks the DJ booth</em><br>" +
                    "<strong>'/unlock'</strong> - <em>unlocks the DJ booth</em><br>" +
                    "<strong>'/lockskip'</strong> - <em>Locks the DJ booth, skips, and unlocks</em><br>"
                    , null, "#FF0000");
            }
        }
        return true;
    }
    if (value.indexOf("/emotes") === 0) {
        appendToChat("<center><strong>Emotes -</strong></center>" +
            "<strong>'/wut'</strong> - <em>Willett must have said something, you give a look of disgust</em><br>" +
            "<strong>'/eyeroll'</strong> - <em>You roll your eyes in dissaproval</em><br>" +
            "<strong>'/boxofwats'</strong> - <em>You lack the vocabulary to describe how weird that last post was, so you provide a box of wats instead</em><br>" +
            "<strong>'/420'</strong> - <em>You look a little high...</em><br>" +
            "<strong>'/yuno'</strong> - <em>Y U NO USE THIS EMOTES!?</em><br>" +
            "<strong>'/fans'</strong> - <em>That random foreign guy keeps asking for fans again, help him out!</em><br>" +
            "<strong>'/cry'</strong> - <em>Dem feels</em><br>" +
            "<strong>'/throw'</strong> - <em>You thow an unkown object out of the chatbox</em><br>" +
            "<strong>Protip: </strong>Replace the slash in front of a command with a '.' and put a message after it to add the emote to the message!"
            , null, "#66FFFF");
        return true;
    }
    if (/^.wut (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function() {API.sendChat(RegExp.$1+" à² _à² ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.fans (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function() {API.sendChat(RegExp.$1+" Have some fans http://i.imgur.com/XHyZS.jpg , http://i.imgur.com/4g3Ir.jpg , http://i.imgur.com/VSn0o.jpg")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.throw (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function() {API.sendChat(RegExp.$1+" (ãƒŽà² ç›Šà² )ãƒŽå½¡ ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.eyeroll (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" Â¬_Â¬")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.cry (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" à²¥_à²¥")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.420 (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" â‰–â€¿â‰–")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.yuno (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" áƒš(à²¥ç›Šà²¥áƒš)")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (/^.boxofwats (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" (>-_-)>[wats]")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }

    if (value.indexOf("/throw") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me (ãƒŽà² ç›Šà² )ãƒŽå½¡")}, 50);
            recentEmote = true;
            setTimeout(function(){recentEmote = false;},60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/wut") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me  à² _à²  ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/420") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me â‰–â€¿â‰–")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/eyeroll") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me Â¬_Â¬")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/boxofwats") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me (>-_-)>[wats]")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/yuno") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me áƒš(à²¥ç›Šà²¥áƒš)")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/cry") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me à²¥_à²¥")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Protection flood installée par le créateur pour éviter tout abus !", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/lockskip") === 0){
        if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,true,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            setTimeout(function(){
                new ModerationForceSkipService();
            }, 100);
            setTimeout(function(){
                new RoomPropsService(Slug,false,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            },300);
            return true;
        }else{
            modChat("", "Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (value.indexOf("/fixbooth") === 0){
        if (Models.room.data.staff[API.getSelf().id] > 2){
            var fixOver = false;
            fixBooth();
            return true;
        }else{
            modChat("", "Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (value.indexOf("/cancelfix") === 0){
        if (Models.room.data.staff[API.getSelf().id] > 2){
            cancelFix = true;
            API.sendChat("/me Fixbooth annulé");
            return true;
        }else{
            modChat("", "Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (value.indexOf("/skip") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            new ModerationForceSkipService();
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
	if (value.indexOf("/history") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            new ModerationForceSkipService();
			Models.chat.sendChat("/em - Ce track ce trouve dans l'historique, ce qui signifie qu'il a été diffusé récemment !");
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (/^\/kick @(.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            reg = RegExp.$1;
            target = reg.trim();
            kick();
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (/^\/remove @(.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            reg = RegExp.$1;
            target = reg.trim();
            removedj();
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (/^\/add @(.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            reg = RegExp.$1;
            target = reg.trim();
            adddj();
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (/^\/whois @(.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            reg = RegExp.$1;
            target = reg.trim();
            getuserinfo();
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (value.indexOf("/lock") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,true,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (value.indexOf("/unlock") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,false,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            return true;
        }else{
            modChat("","Vous n'avez pas la permission de faire cela.");
            return true;
        }
    }
    if (/^\/fan @(.*)$/.exec(value)) {
        reg = RegExp.$1;
        target = reg.trim();
        fan();
        return true;
    }
    if (/^\/unfan @(.*)$/.exec(value)) {
        reg = RegExp.$1;
        target = reg.trim();
        unfan();
        return true;
    }
    if (value.indexOf("/strobe") === 0){
        $("#strobe-menu").click();
        return true;
    }
    if (value.indexOf("/edit on") === 0){
        document.body.contentEditable=true;
        return true;
    }
    if (value.indexOf("/edit off") === 0){
        document.body.contentEditable=false;
        return true;
    }
    if (value.indexOf("/lights") === 0){
        $("#lights-menu").click();
        return true;
    }
    if (value.indexOf("/change") === 0) {
        appendToChat(changeLog, null, "#BAFFAB");
        return true;
    }
    if (value.indexOf("/deltab") === 0) {
        var div = document.getElementById("pdpUsersToggle");
        div.parentNode.removeChild(div);
        return true;
    }
    if (value.indexOf("/hide") === 0) {
        $("#plugbot-btn-hidevideo").click();
        return true;
    }
    if (value.indexOf("/fans") === 0) {
        API.sendChat("Tu veux des fans ? http://i.imgur.com/XHyZS.jpg , http://i.imgur.com/4g3Ir.jpg , http://i.imgur.com/VSn0o.jpg");
        return true;
    }
    if (value == "/avail" || value == "/available") {
        Models.user.changeStatus(0);
        return true;
    }
    if (value == "/brb" || value == "/away") {
        Models.user.changeStatus(1);
        return true;
    }
    if (value == "/work" || value == "/working") {
        Models.user.changeStatus(2);
        return true;
    }
    if (value == "/sleep" || value == "/sleeping") {
        Models.user.changeStatus(3);
        return true;
    }
    if (value == "/idle" || value == "/gaming") {
        Models.user.changeStatus(-1);
        return true;
    }
    if (value.indexOf("/ref") === 0) {
        $("#button-refresh").click();
        return true;
    }
    if (value.indexOf("/join") === 0) {
        API.waitListJoin();
        return true;
    }
    if (value.indexOf("/leave") === 0) {
        API.waitListLeave();
        return true;
    }
    if (value.indexOf("/woot") === 0) {
        $("#button-vote-positive").click();
        return true;
    }
    if (value.indexOf("/meh") === 0) {
        $("#button-vote-negative").click();
        return true;
    }
    if (value.indexOf("/version") === 0) {
        appendToChat(version, null, "#FFFF00");
        return true;
    }
    if (/\/nick (.*)$/.exec(value)) {
        Models.user.changeDisplayName(RegExp.$1);
        return true;
    }
    var playlistID = Models.playlist.getSelected().id;
    if (value.indexOf("/curate") === 0) {
        new DJCurateService(playlistID);
        setTimeout(function(){Dialog.closeDialog();}, 1000);
        return true;
    }
    if (value.indexOf("/alertsoff") === 0)
        if (alerts){
            appendToChat("Alertes désactivées !", null, "#FFFF00");
            alerts = false;
            return true;
        }
    if (value.indexOf("/getpos") === 0) {
        var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
        spot = spot.substring(0, spot.indexOf(')'));
        if (spot !== undefined){
            appendToChat("Waitlist " + spot, null, "#66FFFF");
        }
        else
            appendToChat("Waitlist " + spot, null, "#66FFFF");
        return true;
    }
    if (value.indexOf("/alertson") === 0) {
        if (!alerts){
            appendToChat("Alertes activées !", null, "#FFFF00");
            alerts = true;
        }
        return true;
    }
    return false;
};

Models.chat._chatCommand = Models.chat.chatCommand;
Models.chat.chatCommand = customChatCommand;
ChatModel._chatCommand = ChatModel.chatCommand;

function chat(data) {
    if (data.type == "mention" && !recent) {
        if (/^\/user\/ (.*)$/.exec(awaymsg)) {
            setTimeout(function() {API.sendChat("@"+data.from+" "+RegExp.$1)}, 50);
            recent = true;
            setTimeout(function(){recent=false;},180000);
        }else if(!recent){
            API.sendChat(awaymsg);
            recent = true;
            setTimeout(function() { recent = false; },180000);
        }
    }
}

function fan(data) {
    var usernames = [],id = [],users = API.getUsers();
    for (var i in users) {
        usernames.push(users[i].username);
        id.push(users[i].id);
    }
    if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
    else {
        listlocation = usernames.indexOf(target);
        new UserFanService("fan", id[listlocation]);
    }
}

function unfan(data) {
    var usernames = [],id = [],users = API.getUsers();
    for (var i in users) {
        usernames.push(users[i].username);
        id.push(users[i].id);
    }
    if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
    else {
        listlocation = usernames.indexOf(target);
        new UserFanService("unfan", id[listlocation]);
    }
}
function disable(data) {
    if (data.type == "mention" && Models.room.data.staff[data.fromID] && Models.room.data.staff[data.fromID] >= Models.user.BOUNCER && data.message.indexOf("!disable") > 0) {
        if (autoqueue) {
            $("#plugbot-btn-queue").click();
            setTimeout(function(){ Dialog.closeDialog(); },500);
            API.waitListLeave();
            API.sendChat("@" + data.from + " Autojoin désactivé");
        } else
            API.sendChat("@" + data.from + " Autojoin n'est pas activé");
    }
    if (data.message.indexOf("-strobe on") === 0 && data.fromID === "50aeb07e96fba52c3ca04ca8") {
        if(lights){
            RoomUser.audience.lightsOut(false);
        }
        if (!strobe){
            RoomUser.audience.strobeMode(true);
            updateChat("",",FabienRG active strobe !");
            strobe = true;
        }else{
            updateChat("Strobe est déjà activé!");
        }
    }
    if (data.message.indexOf("-strobe off") === 0 && data.fromID === "50aeb07e96fba52c3ca04ca8") {
        if(lights){
            RoomUser.audience.lightsOut(false);
        }
        if (strobe){
            RoomUser.audience.strobeMode(false);
            strobe = false;
        }
    }
    if (data.message.indexOf("-lights on") === 0 && data.fromID === "50aeb07e96fba52c3ca04ca8") {
        if (!lights){
            if(strobe){
                RoomUser.audience.strobeMode(false);
            }
            RoomUser.audience.lightsOut(true);
            updateChat("",",FabienRG active lights");
            lights = true;
        }
    }
    if (data.message.indexOf("-lights off") === 0 && data.fromID === "50aeb07e96fba52c3ca04ca8") {
        if (lights){
            if(strobe){
                RoomUser.audience.strobeMode(false);
            }
            RoomUser.audience.lightsOut(false);
            lights = false;
        }
    }
}
function kick(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationKickUserService(id[listlocation], " ");
        }
    }
}
Models.history.load();
var skippedsongs = [];
API.addEventListener(API.DJ_UPDATE, repeatcheck);
function repeatcheck(user) {
    var historylist=Models.history.data;
    var currentID=Models.room.data.media.cid;
    for(var j=1; j<49;j++) {
        if (historylist[j].media.cid == currentID) {
            if ($.inArray(currentID, skippedsongs) == -1) {
                systemChat("","Ce track est déjà dans l'historique ("+j+"/50)");
                if (Models.room.data.staff[API.getSelf().id] > 1) {systemChat("", "Tape /history ou clique sur la commande 'history' pour skip.");}
				systemChat("","Regarde l'historique pour être certains que ce message est vrai.");
                skippedsongs.push(currentID);
                break;
            }
        }
    }
}

//Fixbooth
function fixBooth(){
    fixover = false;
    var DJName = API.getDJs()[0].username;
    var boothFix = prompt("Le premier nom sera placé sur la touche. Le deuxième est facultatif, c'est celui qui remplace le premier.", "User1 ||| User2");
    var fixUser = boothFix.split(" ||| ", 5);
    firstUser = fixUser[0];
    secondUser = fixUser[1];
    if (!fixover && boothFix != null) {
        if (boothFix.indexOf(" ||| ") > -1) {
            API.sendChat("/em - Fixbooth: Remplacement " + secondUser + " avec " + firstUser);
            if (DJName === secondUser) {
                API.addEventListener(API.DJ_ADVANCE, boothAdvanceA);
                new RoomPropsService(Slug, true, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
                function boothAdvanceA() {
                    setTimeout(function () {
                        API.sendChat("/remove " + secondUser);
                    }, 50);
                    setTimeout(function () {
                        API.sendChat("/add " + firstUser);
                    }, 100);
                    setTimeout(function () {
                        new RoomPropsService(Slug, false, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
                    }, 150);
                    setTimeout(function () {
                        fixover = true;
                        API.removeEventListener(API.DJ_ADVANCE, boothAdvanceA);
                    }, 200);
                }
            } else {
                API.addEventListener(API.DJ_ADVANCE, boothAdvanceB);
                function boothAdvanceB() {
                    if (DJName === secondUser) {
                        API.sendChat("true");
                        API.addEventListener(API.DJ_ADVANCE, boothAdvanceC);
                        new RoomPropsService(Slug, true, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
                        function boothAdvanceC() {
                            setTimeout(function () {
                                API.sendChat("/remove " + secondUser);
                            }, 50);
                            setTimeout(function () {
                                API.sendChat("/add " + firstUser);
                            }, 100);
                            setTimeout(function () {
                                new RoomPropsService(Slug, false, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
                            }, 150);
                            setTimeout(function () {
                                fixover = true;
                                API.removeEventListener(API.DJ_ADVANCE, boothAdvanceC);
                                API.removeEventListener(API.DJ_ADVANCE, boothAdvanceB);
                            }, 200);
                        }
                    }
                }
            }
        } else {
            API.sendChat("/em - Fixbooth: Remplacement " + DJName + " avec " + firstUser);
            new RoomPropsService(Slug, true, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
            API.addEventListener(API.DJ_ADVANCE, boothAdvanceD);
            function boothAdvanceD() {
                setTimeout(function () {
                    new ModerationRemoveDJService(API.getDJs()[1].id);
                }, 50);
                setTimeout(function () {
                    API.sendChat("/add " + firstUser);
                }, 100);
                setTimeout(function () {
                    new RoomPropsService(Slug, false, Models.room.data.waitListEnabled, Models.room.data.maxPlays, Models.room.data.maxDJs);
                }, 150);
                setTimeout(function () {
                    fixover = true;
                    API.removeEventListener(API.DJ_ADVANCE, boothAdvanceD);
                }, 200);
            }
        }
    }
}
function removedj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationRemoveDJService(id[listlocation]);
        }
    }
}
function adddj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationAddDJService(id[listlocation]);
        }
    }
}
function getuserinfo(data) {
    var usernames = [],atusernames = [],id = [],users = API.getUsers();
    for (var i in users) {
        usernames.push(users[i].username);
        id.push(users[i].id);
    }
    if (usernames.indexOf(target) < 0) log("utilisateur introuvable");
    else {
        listlocation = usernames.indexOf(target);
        var uid = id[listlocation];
        var level = API.getUser(uid).permission;
        var statuscode = API.getUser(uid).status;
        var votecode = API.getUser(uid).vote;
        var mehcount = API.getUser(uid).mehcount;
        if(API.getUser(uid).ambassador == true){
            level = 6
        }
        if(API.getUser(uid).admin == true){
            level = 7
        }

        switch(level){
            case 0:
                var rank = "User";
                break;
            case 1:
                var rank = "Featured DJ";
                break;
            case 2:
                var rank = "Bouncer";
                break;
            case 3:
                var rank = "Manager";
                break;
            case 4:
                var rank = "Co-Host";
                break;
            case 5:
                var rank = "Host";
                break;
            case 6:
                var rank = "Ambassador";
                break;
            case 7:
                var rank = "Admin";
                break;
        }
        switch(statuscode){
            case -1:
                var status = "Idle";
            case 0:
                var status = "Available";
                break;
            case 1:
                var status = "AFK";
                break;
            case 2:
                var status = "Working";
                break;
            case 3:
                var status = "Sleeping";
                break;
        }
        switch(votecode){
            case 0:
                var voted = "Undecided";
                break;
            case -1:
                var voted = "Meh";
                break;
            case 1:
                var voted = "Woot";
                break;
        }

        appendToChat("Name - " + target + "  ||  Rank - " + rank, null, "#cc00cc");
        appendToChat("ID - " + uid, null, "#cc00cc");
        appendToChat("Status - " + status + "  ||  Vote - " + voted, null, "#cc00cc");
        var points = API.getUser(uid).djPoints + API.getUser(uid).curatorPoints + API.getUser(uid).listenerPoints;
        appendToChat("Points - " + points + "  ||  Meh Count - " + mehcount, null, "#cc00cc");

    }


}

for(index in API.getUsers()){if (API.getUsers()[index].mehcount==undefined){API.getUsers()[index].mehcount=0}}

function displayUI2(){
    var btn = document.createElement('div');
	
	function rotate(el, angle)
	{
		$(el).css({
			'-webkit-transform': 'rotate(' + angle + 'deg)',
			'-moz-transform': 'rotate(' + angle + 'deg)',
			'-ms-transform': 'rotate(' + angle + 'deg)',
			'-o-transform': 'rotate(' + angle + 'deg)',
			'transform': 'rotate(' + angle + 'deg)'});
	}
	
	function changeWidth(selector, diff)
	{
		$(selector).width($(selector).width() + diff);
	}
	
	function changeLeft(selector, diff)
	{
		$(selector).css({left: (parseInt($(selector).css('left'), 10) + diff) + 'px'});
	}
	
	function toggleVideo() {
		var pbWidth = $('#playback').width();
		if (!$('#playback').is(":visible"))
		{
			$('#playback').show();
			pbWidth = -pbWidth;
			rotate(btn, 90);
		}
		else
		{
			$('#playback').hide();
			rotate(btn, -90);
		}
		
		changeWidth('#chat', pbWidth);
		changeWidth('#chat-messages', pbWidth);
		changeWidth('.chat-input', pbWidth);
		changeWidth('#bottom-chat-line', pbWidth);
		changeWidth('#chat-header', pbWidth);
		changeWidth('#top-chat-line', pbWidth);
		changeWidth('#chat-input-field', pbWidth);
		
		changeLeft('#chat-mention-suggestion', -pbWidth);
		changeLeft('#chat', -pbWidth);
		
		$.each(document.styleSheets, function(i, styleSheet) {
			$.each(styleSheet.cssRules, function(j, rule) {
				if (rule.selectorText == '.chat-message, .chat-mention, .chat-emote, .chat-skip, .chat-moderation, .chat-system, .chat-update' || rule.selectorText == '.chat-superuser' || rule.selectorText == '.chat-moderator' || rule.selectorText == '.chat-bouncer' || rule.selectorText == '.chat-manager' || rule.selectorText == '.chat-cohost' || rule.selectorText == '.chat-host' || rule.selectorText == '.chat-admin' || rule.selectorText == '.chat-ambassador')
				{
					rule.style.width = (parseInt(rule.style.width, 10) + pbWidth) + 'px';
				}
			})
		});
		
		$('#chat-messages').scrollTop($("#chat-messages")[0].scrollHeight);
	}
	
	$(btn).css({
		'backgroundImage': 'url(http://i.imgur.com/jqbkAOH.png)',
		'right': '32px',
		'width': '30px'
	}).addClass('button-chat-size');
	rotate(btn, 90);
	
	changeWidth('.chat-input', -32);
	changeWidth('#chat-input-field', -32);
	
	$('#chat').append(btn);
	
	$(btn).click(toggleVideo);
	
	$('#button-chat-expand').click(function(){
		$(btn).css({top: $('#button-chat-collapse').css('top')});
	});
	$('#button-chat-collapse').click(function(){
		$(btn).css({top: $('#button-chat-expand').css('top')});
	});
}

$('#plugbot-userlist').remove();
$('#plugbot-css').remove();
$('#plugbot-js').remove();


$('body').prepend('<style type="text/css" id="plugbot-css">'
    + '#strobe {position: absolute; top: 66px;}'
    + '#strobe-menu {position: absolute; color:#3B3B3B; font-variant: small-caps; left: 10px; font-size: 12px; cursor: pointer; padding: 2px 2px 2px 2px;  border-style: solid; border-width: 1px; border-radius: 4px; border-color: #3B3B3B; margin-bottom: 1px; margin-top: 3px;}'
    + '#lights-menu {position: absolute; left: 240px; color:#3B3B3B; left: 268px; font-variant: small-caps; font-size: 12px; cursor: pointer; padding: 2px 2px 2px 2px;  border-style: solid; border-width: 1px; border-radius: 4px; border-color: #3B3B3B; margin-bottom: 1px; margin-top: 3px;}'
    + '#plugbot-ui { position: absolute; left: 325.9px; top: -601.78px;}'
    + '#plugbot-ui p { border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.5); height: 18px; padding-top: 2%; padding-left: 2%; padding-right: 2%; cursor: pointer; font-variant: small-caps; width: 80px; font-size: 13px; margin: 2.5%; }'
    + '#plugbot-ui h2 { border-style: solid; border-width:  1px; border-color: #000 ; height: 9000px; width: 156px; margin: 2.5%; color: #fff; font-size: 12px; font-variant: small-caps; padding: 8px 0 0 13px; }'
	+ '#plugbot-uicontain {min-width: 120px; max-height: 98.6%; overflow-x: hidden; overflow-y: auto; position: fixed; z-index: 99; border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.5); border-right: 0 !important; padding: 0px 0px 12px 0px; }'
    + '#plugbot-userlist {white-space: nowrap; max-width: 150px; max-height: 98.6%; overflow-x: hidden; overflow-y: auto; position: fixed; z-index: 99; border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.5); border-left: 0 !important; padding: 0px 0px 12px 0px; }'
    + '#plugbot-userlist p {padding-right: 15px; margin: 0; padding-top: 4px; text-indent: 24px; font-size: 86%; color: #C3C3C3; }'
    + '#plugbot-userlist p:first-child { padding-top: 0px !important; }'
    + '#plugbot-queuespot { color: #58FAF4; text-align: left; font-size: 15px; margin-left: 8px }');


$("#button-vote-positive").click();

initAPIListeners();
$('body').append('<div id="plugbot-userlist"></div>');
populateUserlist();
displayUI();
displayUI2();
initUIListeners();

}, 5000);
