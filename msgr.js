var io = require('socket.io-client'),
    gpio = require("gpio"),
    video = 'eagle1.mp4';

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

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);