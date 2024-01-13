import { useState, useEffect } from 'react'  
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Room from './Room.jsx'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

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
  
  const [roomName, setRoomName] = useState('')
  const [joinStatus, setJoinStatus] = useState(false)
  const [joinKey, setJoinKey] = useState('')
  const [showA, setShowA] = useState(false)
  const username = useSelector((state) => state.username)
  const userId = useSelector((state) => state.userId)
  const roomKey = useSelector((state) => state.roomKey)
 

  
  
  
  
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
      // console.log(data);
      let success = ''
      if(data.msg){
        console.log(data.msg);
        setMessages(data.msg)
      }
      ;
      if(data.connectFail){
        alert('connection failed, no user found!')
      }
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
        setJoinStatus(true)
        setMessages(data.messages)
      }
      if(data.joinRoomSuccess === false){
        alert('join room failed, no room found!')
      }
      if(data.allUsers){
        setClientList(...clientList, data.allUsers, data.allUsers.newRoom)

        console.log('hit2');
      }
      if(data.updatedRoom){
        setClientList(data.updatedRoom)
        console.log(data.updatedRoom);
      }
      
    })
    
    
  }
  
  


  const sendMsg = (message, roomKey) =>{
    if(!message){
      console.log('no message input');
      return
      } else if (!ws) {
        setMessages([...messages, 'No Websocket connection'])
        return
      }
      ws.send(JSON.stringify({msg:{message, roomKey} }))
      console.log({msg:{message, roomKey}});
      
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
      setJoinStatus(true)
    
    //Send message to websocket server to create room.
    }
    const leaveRoom = (props) => {
      const {roomKey} = props
      const data = {leaveRoom: {userId, roomKey}}
      console.log(userId);
      ws.send(JSON.stringify(data))
      setJoinStatus(false)
    }
    const deleteAcc = async () => {
      await axios.post('http://localhost:5555/api/deleteuser', {userId})
      
    }
    
    const navHome = () => {
      alert('account deleted, logging out...')
      navigate('/')
    }
    const runBoth = () => {
      navHome()
      deleteAcc()
    }

    const [checked, setChecked] = useState(false);
    const toggleCheck= () => setChecked(!checked)
  if(!joinStatus){
  return (
    <main>
      <link rel="stylesheet" href="./App.css"></link>
      <ToggleButton
        className="accountbtn"
        id="toggle-check"
        type="checkbox"
        variant="outline-primary"
        checked={checked}
        value="1"
        onChange={(e) => setChecked(e.currentTarget.checked)}
        position="top-end"
      >
        Checked
      </ToggleButton>
      <ToastContainer
        position="top-end"
       > 
        <Toast show={checked} onClose={toggleCheck}>
          <Toast.Header>
            {username}
          </Toast.Header>
          <Toast.Body>
            <Button onClick={runBoth}>Delete Account</Button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <br></br>
      <h1>Welcome to the chat!</h1>
      
      
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

        <button onClick={openWs}>
          WS connect
        </button>

      </div>
      
      {/* <div>{mappedMessages}</div> */}
    </main>
  )
    }
  if(joinStatus){
    return(
    <Room sendMsg={sendMsg} clientList={clientList} leaveRoom={leaveRoom} messages={messages}/>
    )
  }
}

