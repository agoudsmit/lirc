// Load requirements

var http = require('http'),
    io = require('socket.io'),
    omx = require('omxcontrol'),
    sys = require('sys'),
    exec = require('child_process').exec;

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


// Create server & socket
var server = http.createServer(function(req, res){
  // Send HTML headers and message
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>Running</h1>');
});

server.listen(8080);

io = io.listen(server);

// Add a connect listener
io.on('connection', function(socket) {
  console.log('Client connected.');
  socket.on('omx', function(data){
    console.log('received instruction, player:' +  data.play);

    var vid = 'eagle1.mp4';
    if(data.play !== undefined){
      vid = data.play;
    }

    omx.start(vid, function () {
      console.log('finished playing');
      socket.emit("finish");
      // socket.send('done');
    });
  });

  // Disconnect listener
  socket.on('disconnect', function() {
    console.log('Client disconnected.');
  });

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