require('dotenv').config();
const env = process.env
const tls = require('tls');
const queryString = require('querystring');
const { BOT_TOKEN,HOST,PORT } = process.env

function request(method, data = undefined) {
  return new Promise((resolve, reject) => {
    const options = {
      checkServerIdentity: () => {
        return null
      }
    }

    const socket = tls.connect(PORT, HOST, options, function() {
      const httpVerb = 'POST'
      let payload = `${httpVerb} /bot${BOT_TOKEN}/${method} HTTP/1.1
Host: api.telegram.org
Accept: application/json
Content-Type: application/json; utf-8
User-Agent: UFPA/1.0
`
      if (data) {
        let body = JSON.stringify(data)
        payload += `Content-Length: ${body.length} \r\n\r\n`
        payload += `${body}`
      }

      socket.setEncoding('utf8')
      socket.write(payload)
    })

    socket.on('data', data => {
      // TODO verify everything

      try {
        const str = data.toString()
        // Telegram breaks lines with \r\n
        const lines = str.split('\r\n')

        // Ignore headers
        while (lines.length && lines[0].length !== 0) {
          lines.shift()
        }

        const obj = JSON.parse(lines.join('\n'))

        resolve(obj)
      } catch (error) {
        reject(error)
      }

      socket.end()
    })

    // Do we need this?
    // socket.on('close', () => {
    //     console.log("Connection closed");
    // });

    socket.on('error', error => {
      socket.destroy()
      reject(error)
    })
  })
}

module.exports = request
