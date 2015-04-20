//switch on the beamer
var sys = require('sys'),
    gpio = require("gpio"),
    exec = require('child_process').exec,
    command = "sudo shutdown -h now";

var gpio7 = gpio.export(7, {
   direction: "in",
   ready: function() {
     console.log('ready GPIO /shutdown is high');
   }
});

//listen to GPIO 7
gpio7.on("change", function(val) {
  console.log(val);
  if (val === 0) {
    console.log('GPIO 7 status', false);
  }
  else{
    console.log('switch off PI');

    exec(command, function(error, stdout, stderr){
      if(error)
        console.log("Error sending ;"+command, error, stdout,stderr);
      else
        console.log("Successfully sent ;"+command);
    });
  }
});