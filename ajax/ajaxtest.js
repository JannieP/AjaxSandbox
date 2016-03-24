var xmlreqs = new Array();

function test(pid){

   var url="test.php";
   url=url+"?sid="+Math.random();
   url=url+"&pid="+pid;
   
   xmlhttpGET(url,"aaa",pid);

}

function CXMLReq(freed) {
   this.freed = freed;
   this.xmlhttp = false;
   try{
      // Firefox, Opera 8.0+, Safari
      this.xmlhttp=new XMLHttpRequest();
   }catch (e){
      // Internet Explorer
      try{
         this.xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
      }catch (e){
         this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
   }
}

function xmlhttpGET(url,action,pid) {
   var pos = -1;
   for (var i=0; i<xmlreqs.length; i++) {
      if (xmlreqs[i].freed == 1) { pos = i; break; }
   }
   if (pos == -1) { pos = xmlreqs.length; xmlreqs[pos] = new CXMLReq(1); }
   if (typeof(xmlreqs[pos].xmlhttp) != 'undefined') {
      document.getElementById("log").innerHTML+="Start State"+pid+":"+xmlreqs[pos].xmlhttp.readyState+":"+xmlreqs[pos].xmlhttp.responseText+"<br>";
      xmlreqs[pos].freed = 0;
      xmlreqs[pos].xmlhttp.open("GET",url,true);
      xmlreqs[pos].xmlhttp.onreadystatechange = function() {
         if (typeof(xmlhttpChange) != 'undefined') { xmlhttpChange(pos,action,pid); }
      };
      if (window.XMLHttpRequest) {
         xmlreqs[pos].xmlhttp.send(null);
      } else if (window.ActiveXObject) {
         xmlreqs[pos].xmlhttp.send();
      }
   }
}

function xmlhttpChange(pos,action,pid) {
   if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0){
     document.getElementById("log").innerHTML+="Changed State"+pid+":"+xmlreqs[pos].xmlhttp.readyState+":"+xmlreqs[pos].xmlhttp.responseText+"<br>";
     if(xmlreqs[pos].xmlhttp.readyState == 4) {
      if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304) {
         document.getElementById("log").innerHTML+="Done State"+pid+":"+xmlreqs[pos].xmlhttp.readyState+":"+xmlreqs[pos].xmlhttp.responseText+"<br>";
         updateDiv(action,pid,xmlreqs[pos].xmlhttp.responseText);
      } else {
         //handle_error();
      }
      xmlreqs[pos].freed = 1;
     }
   }
}
