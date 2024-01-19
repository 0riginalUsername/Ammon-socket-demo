import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toast from 'react-bootstrap/Toast'
function RoomPage(props){
    const dispatch = useDispatch()
    const {sendMsg, clientList, leaveRoom, messages, roomName} = props
    console.log(messages);
    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    const userId = useSelector((state) => state.userId)
    const joinStatus = useSelector((state) => state.joinStatus)
    const [messageInput, setMessageInput] = useState('')
    let navigate = useNavigate()

    function setJoinState(joinState){
    
      dispatch({type: 'joinState', payload: joinState})
    }

    useEffect(() => {
        axios.get('/api/check')
        .then(res => {
          if(!res.data.success){
            navigate('/')
          }
        })
    },[])

    function goHome(){
      setJoinState(false)
      }
      
      
      const mappedMessages = messages.map((msg, index) => {
        // console.log(msg);
        return <p key={index}>{msg.message}</p>
      })
      
      console.log(roomName);
    return(
      <div>
        {roomName}
          <br></br>
          {username}
          <br>
          </br>
          ROOMKEY IS: {roomKey}
        <ul>
          <p>USERS IN ROOM</p>
          {clientList.map((client) => {
            return(
              <li key={client.userId}>
              {client.username}
            </li>
            )
          })}        
        </ul>
        <div className="input-block">
          <form onSubmit={(e)=> {
            e.preventDefault()
            sendMsg(messageInput, roomKey)}}>
          <button className="room-btn" >
            SEND MESSAGE &gt;
          </button>

          <input className="user-input" value={messageInput} onChange={(e) => setMessageInput(e.target.value.toUpperCase())}/>
          </form>
      </div>
          {mappedMessages}
        <button className="btn" onClick={()=>leaveRoom({roomKey}) }>LEAVE ROOM</button>
        <button className="btn" onClick={goHome}>ALL ROOMS</button>
        </div>
    )
}

export default RoomPage