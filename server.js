var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

server.listen(process.env.PORT || 8080);

app.use(bodyParser.json());

app.get('/', function (req, res) { res.sendfile(__dirname + '/index.html'); });

app.post('/stripe-webhook', function(request, response){
  if (request.body.type === 'charge.succeeded') {
    io.emit('chargeSucceeded', request.body.data.object);
  }
  if (request.body.type === 'charge.failed') {
    io.emit('chargeFailed', request.body.data.object);
  }  
  response.send('OK');
});

io.on('connection', function (socket) {
  console.log("Connected!");
});