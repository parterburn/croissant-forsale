var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var basicAuth = require('node-basicauth');

app.use(basicAuth({ "cha-ching" : process.env.PASSWORD }));
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

app.get('/payment', function(request, response){
  io.emit('chargeSucceeded', "Cha-ching!");
  response.send('OK');
});

app.get('/denied', function(request, response){
  io.emit('chargeFailed', "Denied!");
  response.send('OK');
});

app.get('/choo-choo', function(request, response){
  io.emit('trainDone', "Choo-choo!");
  response.send('OK');
});

app.get('/applause', function(request, response){
  io.emit('applause', "Yay!");
  response.send('OK');
});

app.get('/crashed', function(request, response){
  io.emit('trainCrashed', "Crashed!");
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
  var show_text;
  var url;
  if (request.query.user_name) {
    show_text = request.query.user_name + " played: " + request.query.text;
    url = request.query.text;
  } else {
    show_text = request.query.url;
    url = request.query.url;
  }
  io.emit('anyURL', url);
  response.send(show_text);
});

app.get('/speak', function(request, response){
  var show_text;
  if (request.query.user_name) {
    show_text = request.query.user_name + " said: " + request.query.text;
  } else {
    show_text = request.query.text;
  }
  io.emit('speak', request.query.text);
  response.send(show_text);
});

io.on('connection', function (socket) {
  console.log("Connected!");
});

server.listen(process.env.PORT || 8080);