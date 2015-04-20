//switch on the beamer
var sys = require('sys'),
    exec = require('child_process').exec;

var device = 'nec399',
    key = 'KEY_POWER',
    command = "irsend SEND_START "+device+" "+key;

exec(command, function(error, stdout, stderr){
  if(error)
    console.log("Error sending command", error, stdout,stderr);
  else
    console.log("Successfully sent command");
});