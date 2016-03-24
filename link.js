var xmlreqs = new Array();

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
   xmlhttpGETparam(url,action,pid,"");
}

function xmlhttpGETparam(url,action,pid,params) {
   var pos = -1;
   for (var i=0; i<xmlreqs.length; i++) {
      if (xmlreqs[i].freed == 1) { pos = i; break; }
   }
   if (pos == -1) { pos = xmlreqs.length; xmlreqs[pos] = new CXMLReq(1); }
   if (typeof(xmlreqs[pos].xmlhttp) != 'undefined') {
      xmlreqs[pos].freed = 0;
      xmlreqs[pos].xmlhttp.open("GET",url,true);
      xmlreqs[pos].xmlhttp.onreadystatechange = function() {
         if (typeof(xmlhttpChange) != 'undefined') { xmlhttpChange(pos,action,pid,params); }
      };
      if (window.XMLHttpRequest) {
         xmlreqs[pos].xmlhttp.send(null);
      } else if (window.ActiveXObject) {
         xmlreqs[pos].xmlhttp.send();
      }
   }
}

function xmlhttpChange(pos,action,pid,params) {
   if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0){
     if(xmlreqs[pos].xmlhttp.readyState == 4) {
      if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304) {
         updateDiv(action,pid,xmlreqs[pos].xmlhttp.responseText,params);
      } else {
         //handle_error();
      }
      xmlreqs[pos].freed = 1;
     }
   }
}

function startProcess(query){
   var url="link.php";
   url=url+ "?" + "a=startprocess";
   url=url+"&sid="+Math.random();
   document.getElementById("errormessage").innerHTML="CREATE<br>";
   xmlhttpGETparam(url,"addProcess",0,query);
}

function doCreateProcess(query,processid){
   document.getElementById("errormessage").innerHTML+="CREATE PROCEsS<br>";
   var url="link.php";
   url=url+ "?" + "a=links"+"&process="+processid + query;
   url=url+"&sid="+Math.random();
   xmlhttpGET(url,"createProcess",processid);
}

function doGetLinks(processid){
   var url="link.php";
   url=url+ "?" + "a=getlinks"+"&process="+processid + query;
   url=url+"&sid="+Math.random();
   xmlhttpGET(url,"getLinks",processid);
}

function doProgressCheck(){
   var url="result.php?a=progress";
   url=url+"&"+"sid="+Math.random();
   xmlhttpGET(url,"progressCheck",0);
}

function doDetails(pid){
   document.getElementById('detailbtn'+pid).innerHTML="<img src='images/clock.gif' />"
   var url="result.php?a=detail&process="+pid;
   url=url+"&"+"sid="+Math.random();
   xmlhttpGET(url,"details",pid);
}

function deleteProcess(pid){
   var answer = confirm ("This will delete the selected entry?")
   if (answer){}
   else return(0);

   var url="result.php?a=delete"+"&process="+pid;
   url=url+"&"+"sid="+Math.random();
   xmlhttpGET(url,"delete",pid);
}

function restart(pid){
   var url="result.php?a=reset&process="+pid;
   url=url+"&"+"sid="+Math.random();
   xmlhttpGET(url,"restart",pid);
}

function moreLinks(processid){
   document.getElementById(processid).innerHTML="<img src='images/clock.gif' />"
   var url="link.php";
   url=url+ "?" + "a=morelinks";
   url=url+ "&" + "process="+processid;
   url=url+"&sid="+Math.random();
   xmlhttpGET(url,"moreLinks",processid);
}

function confirmLinks(pid){
   document.getElementById('confirm'+pid).innerHTML="<img src='images/clock.gif' />"
   var url="result.php";
   url=url+"?"+"a=confirm"+"&"+"process="+pid;
   url=url+"&"+"sid="+Math.random();
   xmlhttpGET(url,"confirmLinks",pid);
}

function updateDiv(action,pid,responseText,params) {
   if (action == "addProcess"){
      document.getElementById("errormessage").innerHTML+=responseText+"<br>";
      doCreateProcess(params,responseText);
   }
   if (action == "createProcess"){
      document.getElementById("errormessage").innerHTML+=responseText+"<br>";
      doProgressCheck();
      doGetLinks(pid);
   }
   if (action == "getLinks"){
      doProgressCheck();
      document.getElementById("process").disabled=false;
   }
   if (action == "progressCheck"){
      document.getElementById("result").innerHTML=buildResult(responseText);
   }
   if (action == "details"){
      document.getElementById('detailbtn'+pid).innerHTML="hide";
      document.getElementById("details"+pid).innerHTML=buildDetails(responseText);
   }
   if (action == "delete"){
      document.getElementById("errormessage").innerHTML="DELETED";
      doProgressCheck();
   }
   if (action == "restart"){
      doProgressCheck();
   }
   if (action == "moreLinks"){
      doProgressCheck();
   }
   if (action == "confirmLinks"){
      document.getElementById("errormessage").innerHTML=responseText;
      document.getElementById('confirm'+pid).innerHTML="Confirm"
   }
}

function buildResult(responseText){
   var result="";
   rows=responseText.split("|");
   if(rows[0]+"" != ""){
      result="<table class='auth_cell_head' width='100%'>";
      result+="<tr><td>&nbsp;</td><td>Date</td><td>KeyWord</td><td>Results</td><td>Processed</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
      for (var i=0;i<rows.length;i++){
         
         result += "<tr>";
            fields=rows[i].split(",");
            result += "<td><a href='#' id='detailbtn"+fields[0]+"' value='show' onclick=moreDetails('"+fields[0]+"')>Show</a></td>";
            for(var j=1;j<fields.length;j++){
               result += "<td class='cell_thin'>";
               result += fields[j];
               result += "</td>";
            }

            result += "<td><a href='#' id='"+fields[0]+"' value='morelinks' onclick=moreLinks('"+fields[0]+"')>Process</a></td>";
            result += "<td><a href='#' id='confirm"+fields[0]+"' value='confirm' onclick=confirmLinks('"+fields[0]+"')>Confirm</a></td>";
            result += "<td><a href='#' id='restart"+fields[0]+"' value='restart' onclick=restart('"+fields[0]+"')>Reset</a></td>";
            result += "<td><a href='#' id='delete"+fields[0]+"' value='delete' onclick=deleteProcess('"+fields[0]+"')>Delete</a></td>";

         result += "<tr>";
            result += "<td colspan=7><div id='details"+fields[0]+"'></div></td>";
         result += "</tr>";

      }
      result += "</table>";
   }
   return(result);   
}

function buildDetails(responseText){

   var fields=responseText.split("|");
   result="<table class='auth_cell_head' width='100%'>";
      result += "<tr style='colour:#123456'>";
         result += "<td>Author</td>";
         result += "<td>Email</td>";
         result += "<td>Url</td>";
         result += "<td>Comment</td>";
      result += "</tr>";
      result += "<tr>";
         result += "<td class='cell_thin'>"+fields[4]+"</td>";
         result += "<td class='cell_thin'>"+fields[5]+"</td>";
         result += "<td class='cell_thin'>"+fields[6]+"</td>";
         result += "<td class='cell_thin'>"+fields[7]+"</td>";
      result += "</tr>";
   result += "</table>";
   result+="<table class='auth_cell_head' width='100%'>";
      result += "<tr>";
         result += "<td>Found</td>";
         result += "<td>Simulated</td>";
         result += "<td>Posted</td>";
         result += "<td>Confirmed</td>";
      result += "</tr>";
      result += "<tr>";
         result += "<td class='cell_thin'>"+fields[0]+"</td>";
         result += "<td class='cell_thin'>"+fields[1]+"</td>";
         result += "<td class='cell_thin'>"+fields[2]+"</td>";
         result += "<td class='cell_thin'>"+fields[3]+"</td>";
      result += "</tr>";
   result += "</table>";
   
   return(result);   
}