/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {
	
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
	
		input = Base64._utf8_encode(input);
	
		while (i < input.length) {
	
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
	
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
	
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
	
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
	
		}
	
		return output;
	},
	
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
	
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
		while (i < input.length) {
	
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			output = output + String.fromCharCode(chr1);
	
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
	
		}
	
		output = Base64._utf8_decode(output);
	
		return output;
	
	},
	
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
	
		for (var n = 0; n < string.length; n++) {
	
			var c = string.charCodeAt(n);
	
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
	
		}
	
		return utftext;
	},
	
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
	
		while ( i < utftext.length ) {
	
			c = utftext.charCodeAt(i);
	
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
	
		}
	
		return string;
	}
};




function connect() {
	
	var url = "https://admin.telemeny.no/api/";
	var method = "GET";
	var postData = "command=alarminfo";
	
	var username = "TEST";
	var password = "nothing";
	
	// You REALLY want async = true.
	// Otherwise, it'll block ALL execution waiting for server response.
	var async = true;
	
	var request = new XMLHttpRequest();
	
	// Before we send anything, we first have to say what we will do when the
	// server responds. This seems backwards (say how we'll respond before we send
	// the request? huh?), but that's how Javascript works.
	// This function attached to the XMLHttpRequest "onload" property specifies how
	// the HTTP response will be handled. 
	request.onload = function () {
	
	   // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
	   // object declared above is available in this function even though this function
	   // executes long after the request is sent and long after this function is
	   // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
	   // applications.
	
	   // You can get all kinds of information about the HTTP response.
	   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
	   var data = request.responseText; // Returned data, e.g., an HTML document.
	}
	
	request.open(method, url, async);
	
	request.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
	
	// Add credentials for login
	request.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ":" + password)); 
	
	// Actually sends the request to the server.
	request.send(postData);
}
