const request = require('./request')

const database = {}
const uname2id = {}
//test account
database[1] = {
    'money': 1000,
    'name': 'Anormaldo'
}
uname2id['@dev'] = {
    id: 1
}

function behave(message) {
    const id = message.from.id
    const name = message.from.first_name
    const chat = message.chat.id
    const uname = message.from.username
    if(message.text === '!join') {
        updateUser(id, name, uname, chat)
        return
    }
    if(message.text === '!wallet') {
        getCoins(id, name, chat)
        return
    }
    if(message.text.startsWith('!transfer')) {
        if(message.text.split(' ').length !== 3) {
            sendMessage(chat, 'That\'s not how you transfer. Dummy!')
            return
        }
        const amount = message.text.split(' ')[1]
        const receiver = message.text.split(' ')[2]
        transfer(id, name, receiver, amount, chat)
    }
    if(database[id] !== undefined) {
        database[id]['money'] += 0.001
    }
}

function transfer(from_id, name, to_at, amount, chat) {
    if(database[from_id] === undefined) {
        sendMessage(chat, `I don\'t KNOW you, ${name}`)
        return
    }
    let output = ''
    if(amount > database[from_id]['money']) {
        output = 'You don\'t have all that cash. You know that. Right?'
    }
    if(uname2id[to_at] === undefined) {
        output = `I don\'t know who ${to_at} is. Does he have a telegram username?`
    }
    if(+amount < 0 || isNaN(+amount)) {
        output = 'Invalid transfer value!'
    }
    if(output === '') {
        const receiver = uname2id[to_at]['id']
        const receiver_name = database[receiver]['name']
        database[from_id]['money'] -= amount
        database[receiver]['money'] += amount
        output = `${amount} transfered from ${name} to ${receiver_name}`
    }
    sendMessage(chat, output)
}

function getCoins(id, name, chat) {
    const output = database[id] === undefined
        ? `I don\'t know you, ${name}.`
        : `${name}. You have ${database[id]['money']} coins.`
    sendMessage(chat, output)
}

function updateUser(id, name, uname, chat) {
    if(database[id] === undefined) {
        newUser(id, name, uname, chat)
        return
    }
    let output = ''
    const old_name = database[id]['name']
    if(old_name !== name) {
        database[id]['name'] = name
        output += `${old_name} renamed to ${name}. `
    }
    if(uname !== undefined && `@${uname}` !== uname2id[id]['uname']) {
        uname2id[id] = {
            uname: `@${uname}`
        }
        output += `At ${uname2id[id]['uname']} updated to @${uname}`
    }
    if(output === '') {
        output = `Nothing to update, ${name}`
    }
    sendMessage(chat, output)
}

function newUser(id, name, uname, chat) {
    let output = ''
    database[id] = {
        'money': 0.01,
        'name': name
    }
    if(uname !== undefined) {
        uname2id[id] = {
           uname: `@${uname}`
        }
    }
    output = `Welcome ${database[id]['name']}! You just won 0.01 coins. Wow!`
    sendMessage(chat, output)
}

async function sendMessage(chat_id, text) {
    await request('sendMessage', {
        chat_id,
        text
    })
    .then(console.log)
    .catch(console.error)
}


module.exports = { behave }
