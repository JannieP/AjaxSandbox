var xmlreqs = new Array();

function CXMLReq(freed) {
	this.freed = freed;
	this.xmlhttp = false;
	if (window.XMLHttpRequest) {
		this.xmlhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function xmlreqGET(url) {
	var pos = -1;
	for (var i=0; i<xmlreqs.length; i++) {
		if (xmlreqs[i].freed == 1) { pos = i; break; }
	}
	if (pos == -1) { pos = xmlreqs.length; xmlreqs[pos] = new CXMLReq(1); }
	if (xmlreqs[pos].xmlhttp) {
		xmlreqs[pos].freed = 0;
		xmlreqs[pos].xmlhttp.open("GET",url,true);
		xmlreqs[pos].xmlhttp.onreadystatechange = function() {
			if (typeof(xmlhttpChange) != 'undefined') { xmlhttpChange(pos); }
		};
		if (window.XMLHttpRequest) {
			xmlreqs[pos].xmlhttp.send(null);
		} else if (window.ActiveXObject) {
			xmlreqs[pos].xmlhttp.send();
		}
	}
}

function fetchStatus(qmname, host, port, channel) {
	if (host == null || host == "" || host == "null"
		|| port == null || port == "" || port == "null"
		|| channel == null || channel == "" || channel == "null") {
	
		document.getElementById(qmname + ".Name").innerHTML="<font color=red>" + qmname + "</font>";
		document.getElementById(qmname + ".Status").innerHTML="<font color=red>9999</font>";
		document.getElementById(qmname + ".Message").innerHTML="<font color=red>A Configuration error occurred while getting details for Queue Manager " + qmname + ". Please contact the MQ Administrator.</font>";
		document.getElementById(qmname + ".ErrorLink").style.display="";
		var url="UpdateQueueManagerStatus.jsp";
		url=url+"?qmname="+qmname;
		url=url+"&host="+host;
		url=url+"&port="+port;
		url=url+"&channel="+channel;
		url=url+"&up=false";
		url=url+"&reasoncode=9999";
		url=url+"&message=A Configuration error occurred while getting details for Queue Manager " + qmname + ". Please contact the MQ Administrator.";
		
		var cxmlreq = new CXMLReq(1);
		if (cxmlreq.xmlhttp) {
			cxmlreq.freed = 0;
			cxmlreq.xmlhttp.open("GET",url,true);
			if (window.XMLHttpRequest) {
				cxmlreq.xmlhttp.send(null);
			} else if (window.ActiveXObject) {
				cxmlreq.xmlhttp.send();
			}
		}
		return;
	}
	var url="FetchQueueManagerStatus.jsp";
	url=url+"?qmname="+qmname;
	url=url+"&host="+host;
	url=url+"&port="+port;
	url=url+"&channel="+channel;
	url=url+"&sid="+Math.random();

	var pos = -1;
	for (var i=0; i<xmlreqs.length; i++) {
		if (xmlreqs[i].freed == 1) { pos = i; break; }
	}
	if (pos == -1) { pos = xmlreqs.length; xmlreqs[pos] = new CXMLReq(1); }
	if (xmlreqs[pos].xmlhttp) {
		xmlreqs[pos].freed = 0;
		xmlreqs[pos].xmlhttp.open("GET",url,true);
		xmlreqs[pos].xmlhttp.onreadystatechange = function() {
			if (typeof(xmlhttpChange) != 'undefined') { xmlhttpChange(pos); }
		}
		if (window.XMLHttpRequest) {
			xmlreqs[pos].xmlhttp.send(null);
		} else if (window.ActiveXObject) {
			xmlreqs[pos].xmlhttp.send();
		}
	}
}

function xmlhttpChange(pos) {
	if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0 && xmlreqs[pos].xmlhttp.readyState == 4) {
		if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304) {
			updateDiv(xmlreqs[pos].xmlhttp.responseXML);
		} else {
			//handle_error();
		}
		xmlreqs[pos].freed = 1;
	}
}

function updateDiv(responseXML) {
	xmlDoc = responseXML.documentElement;
	var qmname = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
	var qmStatus = xmlDoc.getElementsByTagName("reasoncode")[0].childNodes[0].nodeValue;
	var qmMessage = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
	var qmResponse = xmlDoc.getElementsByTagName("response")[0].childNodes[0].nodeValue;
	var idStatus = qmname + ".Status";
	var idMessage = qmname + ".Message";
	if (qmStatus == 0) {
		document.getElementById(idStatus).innerHTML="<font color=green>UP</font>";
		document.getElementById(idMessage).innerHTML="Response time: " + qmResponse + " ms</font>";
		document.getElementById(qmname + ".ErrorLink").style.display="";
		document.getElementById(qmname + ".ErrorLink").innerHTML="Details";
	} else {
		document.getElementById(qmname + ".Name").innerHTML="<font color=red>" + qmname + "</font>";
		document.getElementById(idStatus).innerHTML="<font color=red>" + qmStatus + "</font>";
		document.getElementById(idMessage).innerHTML="<font color=red>" + qmMessage + "</font>";
		document.getElementById(qmname + ".ErrorLink").style.display="";
	}
}
