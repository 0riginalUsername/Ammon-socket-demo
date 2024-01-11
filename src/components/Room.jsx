import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function RoomPage(props){
    const {sendMsg, clientList, leaveRoom, messages} = props
    console.log(messages);
    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    const userId = useSelector((state) => state.userId)
    const [messageInput, setMessageInput] = useState('')
    let navigate = useNavigate()

    useEffect(() => {
        axios.get('/api/check')
        .then(res => {
          if(!res.data.success){
            navigate('/')
          }
        })
    },[])

    function checkList(){
      console.log(clientList);
      }
      
      
      const mappedMessages = messages.map((msg, index) => {
        // console.log(msg);
        return <p key={index}>{msg.message}</p>
      })
      
      
    return(
        <div>
        <ul>
          {clientList.map((client) => {
            return(
              <li key={client.userId}>
              {client.username}
            </li>
            )
          })}        
        </ul>
        <div className="input-block">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
          <button onClick={()=> sendMsg(messageInput, roomKey)}>
            Send message
          </button>
      </div>
          {mappedMessages}
        <br></br>
        {username}
        <br>
        </br>
        Roomkey is: {roomKey}
        <button onClick={()=>leaveRoom({roomKey}) }>Leave Room</button>
        <button onClick={checkList}>Check list</button>
        </div>
    )
}

export default RoomPage