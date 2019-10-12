var net = require('net');

const {BOT_TOKEN} = process.env

var client = new net.Socket();
client.connect(80, '149.154.167.220', function() {
    console.log('Connected');
    
    const payload = `GET /bot${BOT_TOKEN}/getMe HTTP/1.1
Host: api.telegram.org
Accept: */*
User-Agent: UFPA/1.0

`

	client.write(payload)
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});