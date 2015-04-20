// Load requirements

var http = require('http'),
    io = require('socket.io'),
    omx = require('omxcontrol');

// Create server & socket
var server = http.createServer(function(req, res){
  // Send HTML headers and message
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>Aw, snap! 404</h1>');
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

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);