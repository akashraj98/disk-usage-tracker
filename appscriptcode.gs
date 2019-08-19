var website="https://diskbot.cloudstuff.tech/get"
var replyToEmail=""
var SlackChannelWebhookUrl = "https://hooks.slack.com/services/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";
//var warningAlertIconUrl = "http://www.myiconfinder.com/uploads/iconsets/256-256-d126274718a0e884768ab345d31b53c0-alert.png";
//var successAlartIconUrl = "https://thejibe.com/sites/default/files/article/images/ok-icon.png";
var requestOptions = {
  'method' : 'get',
  'muteHttpExceptions': true,
  'headers': {
    'x-monitor-testing':'1'
  }
};
function monitorDisk() {
  var response=performNetworkRequest(website)
  for(var index=0;index < response.diskData.length;index++){   
  //if undifined raise error meaning nothing in database
    Logger.log(response.dateTime.getHours())
    getDiskSheet().getRange("A" + (index + 2)).setValue(response.diskData[index].HOSTNAME);
    getDiskSheet().getRange("C" + (index + 2)).setValue(response.diskData[index].MOUNTPOINT);
    getDiskSheet().getRange("D" + (index + 2)).setValue(response.diskData[index].TOTALSIZE);
    getDiskSheet().getRange("E" + (index + 2)).setValue(response.diskData[index].AVAIL);
    getDiskSheet().getRange("F" + (index + 2)).setValue(response.diskData[index].USED);
    getDiskSheet().getRange("G" + (index + 2)).setValue(response.diskData[index].PERCENTAGEUSED);
    getDiskSheet().getRange("I" + (index + 2)).setValue(response.dateTime);
    if (response.diskData[index].PERCENTAGEUSED.slice(0,-1) < 90){
      var status = "Healthy" 
      getDiskSheet().getRange("H" + (index + 2)).setValue(status);
      getDiskSheet().getRange("H" + (index + 2)).setBackground("#228B22");
    }
    else{
      status = "Unhealthy"
      getDiskSheet().getRange("H" + (index + 2)).setValue(status);
      getDiskSheet().getRange("H" + (index + 2)).setBackground("#DC143C");
      sendMail(index, response,status) 
      //Call
      sendToSlack(index, response,status)
           
    }    
  }
}
/*
 This function perform Network request on the website provided in argument and then
 return JSON object containing responseCode and other disk information.
*/
function performNetworkRequest(website) {
  var response = UrlFetchApp.fetch(website, requestOptions);
  var params = JSON.parse(response.getContentText());
  for (i=0;i<params.length;i++){
    var data = {                  
    "responseCode": response.getResponseCode(),
//    "headers": response.getAllHeaders(),
    "diskData": params,
    "dateTime": new Date()
    };
  return data;
  
  }

}
// This function send the notification to slack
function sendToSlack(index, response,status) {
  var message = "Hostname: " + response.diskData[index].HOSTNAME + "\nStatus: " + status + "\nPercentage Used:" + response.diskData[index].PERCENTAGEUSED + "\nAvailable Space:" + response.diskData[index].AVAIL + "\nResponse Code: " + response.responseCode + "\nTime: " + Utilities.formatDate(response.dateTime, "IST", "dd MMM, yyyy 'at' hh:mm:ss a");
  var payload = { 
    "text": message,
    "username":"vNMonitor Bot",
    "icon_emoji": response.diskData[index].PERCENTAGEUSED.slice(0,-1) < 90 ? ":warning:" : ":white_check_mark:"
  };
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  UrlFetchApp.fetch(SlackChannelWebhookUrl, options);
}

// This function will send email
function sendMail(index, response,status) { 
  var emails = getDiskSheetValue()[index+1][1].toString();
  if(!emails) {
   return; 
  }
  var subject =  "[Disk usage Bot Monitoring alert] "+response.diskData[index].HOSTNAME+ " is "+status +  " Percentage Used:" + response.diskData[index].PERCENTAGEUSED;
  var body = "Hostname: " + response.diskData[index].HOSTNAME + "\nStatus: " + status + "\nPercentage Used:" + response.diskData[index].PERCENTAGEUSED + "\nAvailable Space:" + response.diskData[index].AVAIL + "\nResponse Code: " + response.responseCode + "\nTime: " + Utilities.formatDate(response.dateTime, "IST", "dd MMM, yyyy 'at' hh:mm:ss a"); 
  MailApp.sendEmail(emails, replyToEmail,subject,body);
}

// this function will send notification everyday
function dailyReport(){
  var emails = ["akashraj7713@gmail.com"];
  var lastrow = getDiskSheet().getLastRow();
  var subject="[Disk usage bot Monitor Logs] "+ new Date().toLocaleTimeString();
  var bodyMessage="";
  for(index = 1; index< lastrow; index++){
    if(!getDiskSheetValue()[index][0]==[]){  
    var body = "\n"+"Hostname: " + getDiskSheetValue()[index][0].toString() +"\nStatus: " + getDiskSheetValue()[index][7].toString() +"\nPercentage Used:" + getDiskSheetValue()[index][6].toString() + "\nAvailable Space:" + getDiskSheetValue()[index][4].toString() +  "\nTime: " + getDiskSheetValue()[index][8].toString()+ "\n\n";  
    bodyMessage+=body;
    }
  }
  Logger.log(bodyMessage)
  MailApp.sendEmail(emails, replyToEmail,subject,bodyMessage)  
  var payload = { 
    "text": bodyMessage,
    "username":"vNMonitor Bot",
  };
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  UrlFetchApp.fetch(SlackChannelWebhookUrl, options);
}


//This function returns the current SpreadSheet

function getActiveSpreadSheet(){
  return SpreadsheetApp.getActiveSpreadsheet()
}

// These function(s) return(s) Websites and Logs sheets

function getDiskSheet(){
  return getActiveSpreadSheet().getSheets()[0];
}

function getLogSheet() {
  return getActiveSpreadSheet().getSheets()[1];
}


// These function(s) return(s) Website and Log sheets values as Object[][]
function getDiskSheetValue(){
  return getDiskSheet().getDataRange().getValues(); 
}
function getLogSheetValue(){
  return getLogSheet().getDataRange().getValues();
}
