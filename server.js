var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/speak', function(request, response){
  console.log(request.query);
  io.emit('speak', request.query.text);
  response.send(request.query.text);
});

app.get('/speak_french', function(request, response){
  console.log(request.query);
  io.emit('speakFrench', request.query.text);
  response.send(request.query.text);
});

app.get('/refresh', function(request, response){
  io.emit('refresh', "Refreshed!");
  response.send('OK');
});

io.on('connection', function (socket) {
  console.log("Connected!");
});

server.listen(process.env.PORT || 8080);