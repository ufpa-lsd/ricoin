const request = require('./request')
const behaviour = require('./botBehaviour')

const timeout = time => new Promise(resolve => setTimeout(resolve, time))

async function main() {
  let offset = 0
  const eventLoop = true
  while (eventLoop) {
    const { result } = await request('getUpdates', {
      offset
    })

    for (let update of result) {
      prettyPrint(update)
      const { message } = update

      if (message && !message.from.is_bot) {
        behaviour.behave(message)
        //await request('sendMessage', {
        //  chat_id: update.message.chat.id,
        //  text: `Did you just say '${message.text}'?`
        //})
        //  .then(console.log)
        //  .catch(console.error)
      }

      // Update offset
      offset = update.update_id + 1
    }

    // console.log('Timeout')
    await timeout(500)
  }
}

main()

function prettyPrint(data) {
  console.log(JSON.stringify(data, undefined, 2))
}
