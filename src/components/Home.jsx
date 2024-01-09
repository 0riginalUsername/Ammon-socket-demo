import { useState, useEffect } from 'react'  
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
let ws
export default function Home({count}) {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  function setRoomKey(key){
    // return async (dispatch) => {
      dispatch({type: 'getKey', payload: key})
    // }
  }
  
  function setClients(clients){
    
    dispatch({type: 'getPlayers', payload: clients})
  }
  
  const [clientList, setClientList] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [roomName, setRoomName] = useState('')
  
  const [joinKey, setJoinKey] = useState('')
  const username = useSelector((state) => state.username)
  


  
  
  
  
  useEffect(() => {
    axios.get('/api/check')
    .then(res => {
      if(!res.data.success){
        navigate('/')
      }
    })
  },[])

  
  function closeConnection() {
    if (!!ws) {
      ws.close();
    }
  }
  
  useEffect(()=> {
    openWs()
  }, [])


  function openWs (){
    closeConnection();
    ws = new WebSocket('ws://localhost:5555/api/ws');
    // console.log(WebSocket);
    
    ws.addEventListener('error', () => {
      setMessages([...messages,'WebSocket error']);
    });
    
    ws.addEventListener('open', () => {
      setMessages([...messages,'WebSocket connection established'])
      
    });
    
    ws.addEventListener('close', () => {
      setMessages([...messages,'WebSocket connection closed']);
    });
    
   ws.addEventListener('message', (msg) => { 
      const data = JSON.parse(msg.data);
      console.log(data);
      let success = ''
      if(data.msg){
        console.log('message recieved in DOM');
        setMessages([...messages, data.msg])
      }
      ;
      // console.log(data.data);
      if(data.roomKey){
        let roomKey = data.roomKey
        // console.log(roomKey);
        // setRoomkey([`room key is: `, roomKey])
        setRoomKey(roomKey)
      }

      if(data.users){
        // console.log(data);
        let allClients = data.users
        // console.log(allClients);
        setClients(allClients)
      }
      if(data.joinRoomSuccess){
        setRoomKey(data.joinKey)
        navigate('/room')

      }
      
      
    })
    
    
  }
  
  const sendMsg = () =>{
    
    if(!messageInput){
      return
      } else if (!ws) {
        setMessages([...messages, 'No Websocket connection'])
        return
      }
      ws.send(JSON.stringify({msg: messageInput}))
      // console.log({msg: JSON.stringify(messageInput)});
      
    }

    const closeWs = () => {
      closeConnection()
      setMessages([...messages, 'No Websocket connection'])
    }
    
    
    const joinRoom = () => {
      const data = {joinRoomReq: {username, joinKey}}
      ws.send(JSON.stringify(data))
    }
    const createRoom = () => {
      // const username = useSelector((state) => state.username)
      if(!username){
        return alert('user not found!')
      }
      const data = {createRoom:{name: roomName, username}}
      
      ws.send(JSON.stringify(data))
      navigate('/room')
    
    //Send message to websocket server to create room.
    }

    const login = () => {
      navigate('/login')
    }
    
const mappedClients = clientList.map((client, index) => {
  return <li key={index}>{client}</li>
})
const mappedMessages = messages.map((msg, index) => {
    return <p key={index}>{msg}</p>
  })
  
  
  
  
  return (
    <main>
      {/* <h3>{roomKey}</h3> */}
      <h1>Welcome to the chat!</h1>
      {/* <Link to="/room">
        <button onClick={() => requestRoomCreation()}>Create Room</button>
      </Link> */}
      <div className="input-block">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
          <button onClick={sendMsg}>
            Send message
          </button>
      </div>
      <div className="room-block">
          <input value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
          
          <button onClick={createRoom} >
            Create Room
          </button>
          
      </div>

      <div className="join-room">
        <input value={joinKey} onChange={(e) => setJoinKey(e.target.value)}/>

        <button onClick={joinRoom}>
          Join Room
        </button>

      </div>
      <div>{mappedClients}</div>
      <div>{mappedMessages}</div>
    </main>
  )
}

