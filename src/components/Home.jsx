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
  function setJoinState(joinState){
    
    dispatch({type: 'joinState', payload: joinState})
  }
  
  const [clientList, setClientList] = useState([])
  const [messages, setMessages] = useState([])
  const [checked, setChecked] = useState(false);
  const [roomName, setRoomName] = useState('')
  const [joinKey, setJoinKey] = useState('')
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [allRooms, setAllRooms] = useState([])

  const username = useSelector((state) => state.username)
  const userId = useSelector((state) => state.userId)
  const roomKey = useSelector((state) => state.roomKey)
  const joinState = useSelector((state) => state.joinState)

  
  
  
  
  useEffect(() => {
    axios.get('/api/check')
    .then(res => {
      if(!res.data.success){
        navigate('/')
      }
    })
    if(!userId){
      navigate('/')
    }
    openWs()
  },[])

  useEffect(() => {
    getRooms()
  },[joinState])
  function closeConnection() {
    if (!!ws) {
      ws.close();
    }
  }
  



  function openWs (){
    
    closeConnection();
    ws = new WebSocket('ws://localhost:5555/api/ws');
    
    
    ws.addEventListener('error', () => {
      setMessages([...messages,'WebSocket error']);
    });
    
    ws.addEventListener('open', () => {
      setMessages([...messages,'WebSocket connection established'])
      ws.send(JSON.stringify({connect:{userId:userId}}))
    });
    
    ws.addEventListener('close', () => {
      setMessages([...messages,'WebSocket connection closed']);
    });
    
   ws.addEventListener('message', (msg) => { 
      const data = JSON.parse(msg.data);
      
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
        
        setRoomKey(roomKey)
      }

      if(data.users){
        
        let allClients = data.users
        
        setClients(allClients)
      }
      if(data.joinRoomSuccess){
        // console.log(data);
        // setClientList(data.currRoom)
        setRoomKey(data.joinKey)
        setMessages(data.messages)
        setRoomName(data.roomName)
        setJoinState(true)
      }
      if(data.joinRoomSuccess === false){
        alert('join room failed, no room found!')
      }
      if(data.allUsers){
        setClientList(...clientList, data.allUsers, data.allUsers.newRoom)
        console.log(data.allUsers, data.allUsers.newRoom);
        
      }
      if(data.updatedRoom){
        setClientList(data.updatedRoom)
        console.log(clientList);
      }
      if(data.newRoom){
        
        console.log(data);
        setRoomKey(data.newRoom.roomKey)
        setRoomName(data.newRoom.name)
        
        setJoinState(true)
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
      ws.send(JSON.stringify({msg:{message, roomKey, username} }))
      
      
    }

    const closeWs = () => {
      closeConnection()
      setMessages([...messages, 'No Websocket connection'])
    }
    
    
    const joinRoom = (props) => {
      // console.log(props);
      if(!props){
      const data = {joinRoomReq: {username, joinKey}}
      ws.send(JSON.stringify(data))
      } else {
        const data = {joinRoomReq: {username, joinKey: props}}
        ws.send(JSON.stringify(data))
      }
    }
    const createRoom = () => {
      // const username = useSelector((state) => state.username)
      if(!username){
        return alert('user not found!')
      }
      const data = {createRoom:{name: roomName, username, userId}}
      
      ws.send(JSON.stringify(data))
      
    
    //Send message to websocket server to create room.
    }
    const leaveRoom = (props) => {
      const {roomKey} = props
      const data = {leaveRoom: {userId, roomKey}}
      
      ws.send(JSON.stringify(data))
      setJoinState(false)
    }
    const deleteAcc = async () => {
      await axios.post('http://localhost:5555/api/deleteuser', {userId})
      alert('account deleted, logging out...')
      navigate('/')
      
    }
    
    const navHome = () => {
      
      navigate('/')
    }
    const runBoth = () => {
      deleteAcc()
      navHome()
    }

    const onReg = async (e, formData) => {
      console.log('hit');
      e.preventDefault();
      
      const {username, password} = formData
      
      let data = {
        username,
        password,
        userId
      }
      
      const res = await axios.post(`http://localhost:5555/api/edit`, data);
      
      if (!res.data.success) {
        alert("Username is taken!");
      } 
      if(res.data.success) {
          alert('Account created')
          navigate('/')
      }
    };
    
    const toggleCheck= () => setChecked(!checked)
  
    const getRooms = async() => {
      let res = await axios.post('http://localhost:5555/api/getrooms', {userId})
        setAllRooms(res.data)
    }

    const deleteRoom = async(props) => {
      
       await axios.post('http://localhost:5555/api/deleteroom', {roomId:props})
       .then(res => setAllRooms(res.data))
    }
    const logout = () => {
      navigate('/')
    }
    const mappedRooms = allRooms.map((room, index) => {
      
      
      return (
          <>
          <div className="room-list" key={index} onClick={() => joinRoom(room.roomKey)}>
            <p>Name: {room.name} || Roomkey: {room.roomKey}</p>
        </div>
            {room.host == userId && <button className="btn" onClick={() => deleteRoom(room.roomId)}>Delete room</button>}

          </>
      
      );
    });
  

  if(!joinState){
  return (
    <div>
      <p>Hello, {username}.</p>
      <button className="btn logout-btn" onClick={logout}>LOGOUT</button>
      <ToggleButton
        className="account-btn"
        id="toggle-check"
        type="checkbox"
        
        checked={checked}
        value="1"
        onChange={(e) => setChecked(e.currentTarget.checked)}
        position="top-end"
      >
        ACCOUNT SETTINGS
      </ToggleButton>
      <ToastContainer
        position="top-end"
       > 
        <Toast show={checked} onClose={toggleCheck} className="toast">
          <Toast.Header>
            {username}
          </Toast.Header>
          <Toast.Body>
          <form
        onSubmit={(e) => {
          e.preventDefault();
          onReg(e, {
            username: usernameValue,
            password: passwordValue,
          });
        }}
      >
        <label htmlFor="username">USERNAME &gt;</label>
        <input 
          className="home-input" 
          name="username"
          id="username"
          type="text"
          required
          maxLength={15} // Limit username to 20 characters
          onChange={(e) => setUsernameValue(e.target.value.toUpperCase())}
          value={usernameValue}
        />
        <br></br>
        <label htmlFor="password">PASSWORD &gt;</label>
        <input
          name="password"
          id="password"
          type="password"
          required
          maxLength={15} // Limit username to 20 characters
          onChange={(e) => setPasswordValue(e.target.value)}
          className="home-input"
        />
        <button className="btn" type="submit">
          REGISTER
        </button>
      </form>
            <Button onClick={runBoth}>DELETE ACCOUNT</Button>
          </Toast.Body>
        </Toast>
      </ToastContainer>

    <main className='home'>
          {mappedRooms}
        
         <div className="room-stuff">
          <button className="btn"onClick={createRoom} >
            CREATE ROOM &gt;
          </button>
          <input className="home-input"value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
    
        <button className="btn" onClick={() => joinRoom(joinKey)}>
          JOIN ROOM &gt;
        </button>
        <input className="home-input"value={joinKey} onChange={(e) => setJoinKey(e.target.value)}/>
        </div> 
    </main>
    </div>
  )
    }
  if(joinState){
    return(
    <Room sendMsg={sendMsg} clientList={clientList} leaveRoom={leaveRoom} messages={messages} roomName={roomName}/>
    )
  }
}

