/* Author: 
	Written by Daniel Grossmann-Kavanagh (dtkav)	


*/
window.s3 = {};

var bucketName = localStorage.bucketName || (localStorage.bucketName = window.prompt("bucket name")),
accessKey = localStorage.accessKey || (localStorage.accessKey = window.prompt("aws access key")),
secret = localStorage.secret || (localStorage.secret = window.prompt("aws secret")),
baseUrl = "https://" + bucketName + ".s3.amazonaws.com/",
lastPlayed

$(aws_id)[0].value = accessKey
$(aws_secret)[0].value = secret
$(aws_bucket)[0].value = bucketName

$(creds).submit(function(){ 
	localStorage.accessKey = accessKey = $(aws_id)[0].value;
	localStorage.secret = secret = $(aws_secret)[0].value;
	localStorage.bucketName = bucketName = $(aws_bucket)[0].value;
	baseUrl = "https://" + bucketName + ".s3.amazonaws.com/",

	loadXMLDoc();
	return false; // stop bubble up
});


try{
	s3.playlist = jQuery.parseJSON(localStorage.bucketList);
} catch(err) {
	console.log("no local storage, get bucket list");
}
loadXMLDoc() 


$(player)[0].play_notpause = true; // play


function httpDate(d) {
	// Use now as default date/time.
	if (!d) { d = new Date(); }

	// Date abbreviations.
	var daysShort   = ["Sun", "Mon", "Tue", "Wed",
					   "Thu", "Fri", "Sat"];
	var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
					   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// See: http://www.quirksmode.org/js/introdate.html#sol
	function takeYear (theDate) {
		var x = theDate.getYear();
		var y = x % 100;
		y += (y < 38) ? 2000 : 1900;
		return y;
	}

	// Number padding function
	function zeropad (num, sz) { 
		return ( (sz - (""+num).length) > 0 ) ? 
			arguments.callee("0"+num, sz) : num; 
	}
	
	function gmtTZ (d) {
		// Difference to Greenwich time (GMT) in hours
		var os = Math.abs(d.getTimezoneOffset());
		var h = ""+Math.floor(os/60);
		var m = ""+(os%60);
		if (h.length === 1) { h = "0"+h; }
		if (m.length === 1) { m = "0"+m; }
		return d.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
	}

	return [
		daysShort[d.getDay()], ", ",
		d.getDate(), " ",
		monthsShort[d.getMonth()], " ",
		takeYear(d), " ",
		zeropad(d.getHours(), 2), ":",
		zeropad(d.getMinutes(), 2), ":",
		zeropad(d.getSeconds(), 2), " ",
		gmtTZ(d)
	].join('');
}


function handleStateChange() {
	if (this.readyState==4) {
		localStorage.bucketList = JSON.stringify(xmlToJson(this.responseXML));
		console.log(localStorage.bucketList);
		s3.player.playlist();
	}
}

function getXMLHttpRequest() {
	// Shamelessly swiped from MochiKit/Async.js
	var self = arguments.callee;
	if (!self.XMLHttpRequest) {
		var tryThese = [
			function () { return new XMLHttpRequest(); },
			function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
			function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
			function () { return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
			function () { return null; }
		];
		for (var i = 0; i < tryThese.length; i++) {
			var func = tryThese[i];
			try {
				self.XMLHttpRequest = func;
				return func();
			} catch (e) {
				// pass
			}
		}
	}
	return self.XMLHttpRequest();
}

function loadXMLDoc(url) {
	if(url == undefined){
		url = '';
	}
	var http_date = httpDate();
	// Build the string to sign for authentication.
	var s = [
		"GET", "\n\n\n\n",
		"x-amz-date:", http_date, "\n",
		"/" + bucketName + "/" + url
	].join('');
		
	// Sign the string with our secret_key.
	var signature = crypto.sha.aws(s, secret);
	var auth = "AWS AKIAJ2YCKGYNRKTYH67A:"+signature;
        console.log(s);		
		
	var xhr = new getXMLHttpRequest();
	xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
	xhr.open("GET", baseUrl + url, true);
	xhr.setRequestHeader("Authorization", auth);
	xhr.setRequestHeader("x-amz-date", http_date);
	xhr.send();
}

// Changes XML to JSON
//http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].length) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


s3link = function(key){
	var url = baseUrl;
	url += key;
	url += "?AWSAccessKeyId="
	url += accessKey;
	url += "&Signature=";
	
	d = new Date(2012,8,20)
	var http_date = httpDate(d);
	var mydate = parseInt(d.getTime() / 1000)
	// Build the string to sign for authentication.
	r = / /g;
	urlkey = key.replace(r, '%20');
	var s = "GET\n\n\n" + mydate + "\n/" + bucketName + "/" + urlkey;
	console.log(s);
	// Sign the string with our secret_key.
	var signature = crypto.sha.aws(s, secret);
	

	
	signature = escape(signature);
	r = /[+]/g;
	signature = signature.replace(r, '%2B');
	url += signature
	url += "&Expires=" + mydate;
	
	return url;
}




window.onresize = resize = function(showSettings) {
	var latch;
	return function(showSettings){
		$(response).height(window.innerHeight - 88);
		$(sidebar).height(window.innerHeight - 88);
		$(settings).height(window.innerHeight - 88);
		if(typeof(showSettings) === 'number'){
			latch = showSettings;
		}
		if(typeof(latch) === 'undefined'){
			latch = 0;
		}
		if(latch === 1){
			console.log("settings");
			$(settings).width(parseInt(window.innerWidth * .85));
			$(response).width(0);
			$(settings).show();
		} else {
			console.log("playlist");
			$(settings).width(0);
			$(response).width(parseInt(window.innerWidth * .85));
		}
		$(sidebar).width(parseInt(window.innerWidth * .15));
	}
}();
resize();

$(menu).children().first().click(function(){resize(0)});
$(menu).children().first().next().click(function(){resize(1)});






s3.player = (function() {
	var audio = $(player)[0];
	
	var updatePlaying = function(current) {
		if(typeof(lastPlayed) !== 'undefined'){
			lastPlayed.className = lastPlayed.className.replace( /(?:^|\s)playing(?!\S)/ , '' );
		}
		current.className += " playing";
		lastPlayed = current;
	}

	var playlist = function() {
		if(typeof(localStorage.bucketList) === 'undefined') {
			return false;
		}
		console.log("populating playlist")
		try {
			$(list).remove()
		} catch(err) {}
		r=/.mp3/
		var mp3 = {};
		mp3.keys = [];
		var ul = document.createElement("ul");
		ul.id = "list";
		$(response).append(ul);
		s3.playlist = jQuery.parseJSON(localStorage.bucketList);
		$.each(s3.playlist.ListBucketResult.Contents, function(i,e){
			var key = this.Key['#text'];
			if(r.test(key.slice(-4))){
				mp3.keys.push(key);
				var a = document.createElement("a");
				var b = document.createElement("li");
				a.key=key;
				a.innerHTML = key;
				a.className = "track";
				b.appendChild(a);
				b.className = "track_li";
				$(list).append(b);
			}
		});
		localStorage.songs = JSON.stringify(mp3);

		// playlist song 'click' event handler
		$(".track_li").click(function(){
			var key = this.firstChild.key;
			console.log(key);
			player.src = s3link(key);
			player.play();
			updatePlaying(this);
			li = document.createElement("li");
			var keySplit = key.split('/')
			li.innerHTML = keySplit[keySplit.length - 1].split('.mp3')[0];
			$(nowplaying).children().append(li);
		});



		return true;
	}

	var nextSong = function() {
		console.log(lastPlayed.nextElementSibling.firstChild.key);
		player.src = s3link(lastPlayed.nextElementSibling.firstChild.key);
		player.play();
		updatePlaying(lastPlayed.nextElementSibling);
	}

	var prevSong = function() {
		console.log(lastPlayed.previousElementSibling.firstChild.key);
		player.src = s3link(lastPlayed.previousElementSibling.firstChild.key);
		player.play();
		updatePlaying(lastPlayed.previousElementSibling);
	}

	var updateControls = function(playing) {
		if(player.playing){
			$(player_play_pause)[0].className += " playing";
		} else {
			$(player_play_pause)[0].className = $(player_play_pause)[0].className.replace( /(?:^|\s)playing(?!\S)/g , '' );
		}
	}

	var initialize = function() {
		//if(!playlist()) {
		//	setTimeout(s3.player.init, 1000);
		//	return;
		//}
		$(player_next).click(function(){s3.player.next();});
		$(player_previous).click(function(){s3.player.previous();});
		audio.addEventListener('play', function(){this.playing = 1; console.log(audio.playing); updateControls();})
		audio.addEventListener('pause', function(){this.playing = 0; console.log(audio.playing); updateControls();})
		audio.addEventListener('ended', nextSong);
		String.prototype.pad = function(l, s){
			return (l -= this.length) > 0 
				? (s = new Array(Math.ceil(l / s.length) + 1).join(s)).substr(0, s.length) + this + s.substr(0, l - s.length) 
				: this;
		};
		$(player).bind('timeupdate', function() {
			//var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
			//loadingIndicator.css({width: loaded + '%'}); 
			var secs = Math.floor(audio.currentTime % 60);
			var mins = Math.floor(audio.currentTime / 60);
			var dsecs = Math.floor(audio.duration % 60);
			var dmins = Math.floor(audio.duration / 60);
			var percent = (audio.currentTime / audio.duration) * 100;
			$(player_elapsed).text((mins > 9 ? mins : '0' + mins) + ":" + (secs > 9 ? secs : '0' + secs));
			$(player_duration).text((dmins > 9 ? dmins : '0' + dmins) + ":" + (dsecs > 9 ? dsecs : '0' + dsecs));
			$(player_seeking_progress).css('width', '' + percent + "%")
		});

		// restore scroll position if in localStorage
		if(typeof(localStorage.scrollPos) === 'string') {
			console.log("restore scroll pos");
			$(response).scrollTop(localStorage.scrollPos);
		}

		// save scroll position to localStorage to survive page refresh
		$(response).scroll(function(){
			localStorage.scrollPos = $(response).scrollTop();
		});

		// play/pause handler
		$(player_play_pause).click(function(e){
			if (audio.paused) { audio.play(); } 
			else { audio.pause(); }  
		});
	}

	return {
		init: function () {
			return initialize();
		},
		playlist: function () {
			return playlist();
		},
		next: function () {
			return nextSong();
		},
		previous: function () {
			return prevSong();
		},
		update: function (song) {
			return updatePlaying(song);
		}
    };
})();

s3.player.init();

