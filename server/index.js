
import express from 'express'
import http from 'http'
import cors from 'cors'
import WebSocket, {WebSocketServer} from 'ws'
import {v4 as uuidv4} from 'uuid'
import session from 'express-session'
import handlerFunctions from './controller.js'
import ViteExpress from 'vite-express'
import {Room, User} from './model.js'

const {login, register, checkSession} = handlerFunctions


const app = express()

const port =  5555

app.use(cors())
app.use(session({secret: 'quiet', saveUninitialized: true, resave: false, cookie: {sameSite: false}}))
app.use(express.json())

app.get('/api/check', checkSession)
app.post('/api/auth', login)
app.post('/api/newuser', register)


const server = ViteExpress.listen(app, port, () => console.log(`Server running on port ${port}!`))
const wss = new WebSocketServer({ server: server, path: '/api/ws' })

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





// HTTP connections
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// WebSocket connections
const clients = {}
let globalRooms = {}

// {
//   asdknazroq234r6: {
//     // room info
//   },
//   aiwenigfdfxuznlivx21324580albie: {

//   }
// }


wss.on('connection', (ws) => {
  console.log('Client connected')
  const id = uuidv4()
  clients[id] = ws
//   console.log(ws);

  
  ws.on('error', console.error)

  ws.on('message', async (data) => {
    
      //  const message = isBinary? JSON.parse(data):data
      
      const message = JSON.parse(data)
      if(message.msg){
          console.log('Recieved message =>', message.msg)
        } 
        // console.dir(message, {depth: null})
        if (message.createRoom) {
      
            
            let roomKey = makeId()
            // console.log(message.createRoom.username);
            let username = message.createRoom.username
            let room = {
                roomKey,
                name: message.createRoom.name,
                host: username
              }
              // write sequelize here
              const newRoom = await Room.create(room)
              const foundUser = await User.findOne({
                where: {username}
              })
              await newRoom.addUser(foundUser)
              let players = await newRoom.getUsers()
              newRoom.players = players
              // end sequelize stuff
              
              
              wss.clients.forEach((client) => {
                client.send(JSON.stringify(newRoom))
              })
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
      // clients[id].send(JSON.stringify({roomId}))
    } else if (message.joinRoomReq) {

        // console.log(message.joinRoomReq.joinKey);
        console.log(globalRooms);
        let joinKey = message.joinRoomReq.joinKey
        let username = message.joinRoomReq.username
        let foundRoom = await Room.findOne({where:
          {roomKey: joinKey}})
        console.log(foundRoom);
        if(foundRoom.roomKey === joinKey){
          
          // let currentRoom = globalRooms[joinKey]
          console.log('joined room!');
          // currentRoom.usernames.push(username)
          
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({joinRoomSuccess: true, joinKey}))
          })
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

