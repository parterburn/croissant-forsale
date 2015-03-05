var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var basicAuth = require('node-basicauth');
var password;
if (process.env.PASSWORD) {
  password = process.env.PASSWORD;
} else {
  password = "test";
}


app.use(basicAuth({ "cha-ching" : password }));
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

app.get('/volume', function(request, response){
  io.emit('volume', request.query.text);
  response.send('Volume set to ' + request.query.text);
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
  console.log(request.query);
  var url;
  if (request.query.text) {
    url = request.query.text;
  } else {
    url = request.query.url;
  }
  io.emit('anyURL', url);
  response.send(url);
});

app.get('/speak', function(request, response){
  console.log(request.query);
  io.emit('speak', request.query.text);
  response.send(request.query.text);
});

io.on('connection', function (socket) {
  console.log("Connected!");
});

server.listen(process.env.PORT || 8080);