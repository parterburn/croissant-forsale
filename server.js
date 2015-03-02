var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

var express = require('express');
var app = express.createServer();
var basicAuth = require('basic-auth-connect');

app.use(basicAuth(process.env.USERNAME, process.env.PASSWORD));
app.use(express.static(__dirname));
app.use(express.bodyParser())

app.post('/stripe-webhook', function(request, response){
	if (request.body.type === 'charge.succeeded') {
		emitter.emit('chargeSucceeded', "Success");
	}
  if (request.body.type === 'charge.failed') {
    emitter.emit('chargeFailed', "Failed");
  }  
	response.send('OK');
});

function chargeServer(client, con) {
	con.on('ready', function () {
		if (typeof client['chargeSucceeded'] === 'function') {
			emitter.on('chargeSucceeded', client['chargeSucceeded']);
		}
    if (typeof client['chargeFailed'] === 'function') {
      emitter.on('chargeFailed', client['chargeFailed']);
    }    
    });

    con.on('end', function () {
        if (typeof client['chargeSucceeded'] === 'function') {
            emitter.removeListener('chargeSucceeded', client['chargeSucceeded']);
        }
        if (typeof client['chargeFailed'] === 'function') {
            emitter.removeListener('chargeFailed', client['chargeFailed']);
        }        
    });
}

app.listen(process.env.PORT || 8080);

// then just pass the server app handle to .listen()!

var dnode = require('dnode');
var server = dnode(chargeServer);
server.listen(app, {"io":{"transports":['xhr-polling'], "polling duration":10}});
