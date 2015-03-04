var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var basicAuth = require('node-basicauth');

//app.use(basicAuth({ "cha-ching" : process.env.PASSWORD }));
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/stripe-webhook', function(request, response){
  if (request.body.type === 'charge.succeeded') {
    io.emit('chargeSucceeded', request.body.data.object);
  }
  if (request.body.type === 'charge.failed') {
    io.emit('chargeFailed', request.body.data.object);
  }
  if (request.body.type === 'charge.refunded') {
    io.emit('chargeRefunded', request.body.data.object);
  }
  response.send('OK');
});

app.post('/circle-webhook', function(request, response){
  if (request.body.payload.branch === "master") {
    if (request.body.payload.outcome === "success") {
      io.emit('trainDone', "Choo Choo");    
    } else {
      io.emit('trainCrashed', "Choo Choo");
    }
  }
  response.send('OK');
});

app.post('/deploy', function(request, response){
  io.emit('deploy', "New Deploy");
  response.send('OK');
});

app.get('/refresh', function(request, response){
  io.emit('refresh', "Refreshed!");
  response.send('OK');
});

app.get('/any-url', function(request, response){
  console.log(request.query.url);
  io.emit('anyURL', request.query.url);
  response.send('Now listen...');
});

app.get('/speak', function(request, response){
  console.log(request.body.text);
  io.emit('speak', request.body.text);
  response.send('Now listen...');
});

app.post('/speak', function(request, response){
  console.log(request.query.words);
  io.emit('speak', request.query.words);
  response.send('Now listen...');
});

io.on('connection', function (socket) {
  console.log("Connected!");
});

server.listen(process.env.PORT || 8080);