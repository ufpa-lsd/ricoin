var net = require('net');

var client = new net.Socket();
client.connect(80, '93.184.216.34', function() {
    console.log('Connected');
    
    const payload = `GET /index.html HTTP/1.1
Host: www.example.org
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