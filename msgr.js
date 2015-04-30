var io = require('socket.io-client'),
    gpio = require("gpio"),
    sys = require('sys'),
    exec = require('child_process').exec,
    video = 'eagle1.mp4';


//start up beamer
var device = 'nec399',
    key = 'KEY_POWER',
    command = "irsend SEND_START "+device+" "+key;

exec(command, function(error, stdout, stderr){
  if(error)
    console.log("Error sending command", error, stdout,stderr);
  else
    console.log("Successfully sent command");
});
//done

//start up PIR
console.log('start node server /w PIR');
var gpio27 = gpio.export(27, {
   direction: "in",
   ready: function() {
     console.log('ready PIR is high');
   }
});

var live1 = false;

/* build connections */
var socketClient1 = io.connect('http://192.168.1.126:8080', {reconnect: true});
socketClient1.on('connect', function (data) {
  console.log('connected to client 1');

  //ready to play video, wait for PIR trigger
  live1 = true;
});

var socketClient2 = io.connect('http://192.168.1.127:8080', {reconnect: true});
socketClient2.on('connect', function (data) {
  console.log('connected to client 1');
});
/* end connections */

/* socket listeners */
socketClient1.on("finish", function(data){
   console.log('finished playing client 1 video:'+video);

   //trigger next to play
   socketClient2.emit('omx', { play: video });
});

socketClient2.on("finish", function(data){
   console.log('finished playing 2 video:'+video);

   //reset sequence
   live1 = true;
});
/* end socket listeners */

//listen to GPIO 27
gpio27.on("change", function(val) {
  console.log(val);
  if (val === 0) {
    console.log('pirstatus', false);
  }
  else{

    //connected, PIR triggered > all is go
    if(live1)
    {
      //block till end of sequence
      live1 = false;
      socketClient1.emit('omx', { play: video });
      console.log('playing video:'+video);
    }
  }
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");
    process.exit();
  });
  
   // if after 
   setTimeout(function() {
     console.error("Could not close connections in time, forcefully shutting down");
     process.exit();
  }, 10*1000);
};

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);