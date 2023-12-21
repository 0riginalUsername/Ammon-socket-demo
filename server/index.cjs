const express = require('express')
const http = require('http')
const cors = require('cors')
const WebSocket = require('ws')
const uuid = require('uuid')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server: server, path: '/api/ws' })

const port =  5555

app.use(cors())

// HTTP connections
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// WebSocket connections
const clients = {}
const rooms = {}

wss.on('connection', (ws) => {
  console.log('Client connected')
  const id = uuid.v4()
  clients[id] = ws
  
  ws.on('error', console.error)

  ws.on('message', (data, isBinary) => {
    // console.log(JSON.parse(data))
    //  const message = isBinary? JSON.parse(data):data
    const message = JSON.parse(data)
    console.log('Recieved message =>', message.msg)
    
    // console.dir(message, {depth: null})
    if (message.createRoom) {
      const roomId = uuid.v4()
      const key = uuid.v4()
      rooms[key] = {
        id: roomId,
        key: key,
        name: message.createRoom.name,
        users: [ws]
      }

      // clients[id].send(JSON.stringify({roomId}))
    } else if (message.joinRoom) {
      const room = rooms[message.joinRoom.key]
      if (room) {
        room.users.push({user_id: id, name: 'Ammon'})

        for (const user in room.users) {
          clients[user].send(JSON.stringify({room}))
        }
      }
    } else if (message.startGame) {
      
    } else if (message.msg){
      console.log('sent msg');
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
            // console.log(client);
        } 
    });
    }


    
  })

  // console.log(JSON.stringify({message: 'Client connected'}))
  // console.log(JSON.pa({message: 'Client connected'}))

  // const clients = {1234: wsclient1, 34235: wsclient2}
  // wsclient1.send()
  // ws.send()
  ws.on('close', () => {
    console.log(`Client disconnected`)
    delete clients[id]
    
    for (const client in clients) {
      clients[client].send(JSON.stringify({message: `Client ${id} disconnected`}))
    }
  })

  // const clientIds = Object.keys(clients)
  for (const client in clients) {
    clients[client].send(JSON.stringify({message: `Client ${id} connected`}))
  }
})

server.listen(port, () => console.log(`Server running on port ${port}!`))
  