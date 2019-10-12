var tls = require('tls');
var fs = require('fs');

const PORT = 443;
const HOST = '149.154.167.220'
const { BOT_TOKEN } = process.env

// Pass the certs to the server and let it know to process even unauthorized certs.
var options = {
    // key: fs.readFileSync('private-key.pem'),
    // cert: fs.readFileSync('public-cert.pem'),
    checkServerIdentity: () => { return null; },
    // rejectUnauthorized: false
};

var client = tls.connect(PORT, HOST, options, function() {

    // Check if the authorization worked
    if (client.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + client.authorizationError)
    }

    // Send a unfriendly message
    const payload = `GET /bot${BOT_TOKEN}/getMe HTTP/1.1
Host: api.telegram.org
Accept: */*
User-Agent: UFPA/1.0

`
    client.write(payload)

});

client.on("data", function(data) {

    // console.log('Received: %s [it is %d bytes long]',
    //     data.toString().replace(/(\n)/gm,""),
    //     data.length);

    const obj = JSON.parse(data.toString().split('\n').pop())
    console.log(obj)

    // Close the connection after receiving the message
    client.end();

});

client.on('close', function() {

    console.log("Connection closed");

});

// When an error ocoures, show it.
client.on('error', function(error) {

    console.error({error});

    // Close the connection after the error occurred.
    client.destroy();

});