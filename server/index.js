
import express from 'express'
import http from 'http'
import cors from 'cors'
import WebSocket, {WebSocketServer} from 'ws'
import {v4 as uuidv4} from 'uuid'
import session from 'express-session'
import handlerFunctions from './controller.js'

const {login, register, checkSession} = handlerFunctions


const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server: server, path: '/api/ws' })

const port =  5555

app.use(cors())
app.use(session({secret: 'quiet', saveUninitialized: true, resave: false, sameSite: false}))
app.use(express.json())

// app.post('/api/check', checkSession)
app.post('/api/auth', login)
app.post('/api/newuser', register)

function makeId() {

  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

class Room {
    constructor(rooms){
        this.key = rooms.key,
        this.name = rooms.name
        this.usernames = rooms.usernames
    }
}



// HTTP connections
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// WebSocket connections
const clients = {}
let globalRooms = {}


wss.on('connection', (ws) => {
  console.log('Client connected')
  const id = uuidv4()
  clients[id] = ws
//   console.log(ws);

  
  ws.on('error', console.error)

  ws.on('message', (data) => {
      // console.log(JSON.parse(data))
      //  const message = isBinary? JSON.parse(data):data
      
      const message = JSON.parse(data)
      if(message.msg){
          console.log('Recieved message =>', message.msg)
        } 
        // console.dir(message, {depth: null})
        if (message.createRoom) {
            let roomId = uuidv4()
            let roomKey = makeId()
            // console.log(message.createRoom.username);
            let usernames = [message.createRoom.username]
            let rooms = {
                key: roomKey,
                name: message.createRoom.name,
                usernames
            }
            
             let roomKeyName = new Room(rooms)
            console.log(roomKeyName);
        // rooms.id= roomId
        // rooms.key = key
        // rooms.name = message.createRoom.name
        // rooms.usernames= usernames
        
        // console.log('room info: ',rooms);
        // console.log(`room created, entry key is:, ${key}, room creator is ${usernames[0]}`);
        
        if(!message.createRoom.username){
            console.log('room creation failed! no user found!');
            const data = {success: false}
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(data))
              })
        }
        //   console.log(rooms.users.clients);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(rooms))
      })
      // clients[id].send(JSON.stringify({roomId}))
    } else if (message.joinRoomReq) {
        // console.log(message.joinRoomReq.joinKey);
        console.log(globalRooms);
        let joinKey = message.joinRoomReq.joinKey
        
      if(joinKey === roomKeyName.key){
          console.log('correct key!');
        }
        else{console.log('wrong key stupid!');}
        
    }
    //   const room = rooms[message.joinRoom.key]

    //   if (room) {
    //     room.users.push({user_id: id, name: 'Ammon'})

    //     for (const user in room.users) {
    //       clients[user].send(JSON.stringify({room}))
    //     }
    //   }
    // } 
    else if (message.users) {
      ;
    } else if (message.msg){
      console.log('sent message');
      wss.clients.forEach((client) => {
        //   console.log(client.readyState);
        if (client.readyState === WebSocket.OPEN) {
            // console.log('hit');
            client.send(JSON.stringify(message));
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