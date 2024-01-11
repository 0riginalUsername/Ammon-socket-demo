import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// import {Room} from '../../server/model.js'
function RoomPage(props){
    const {sendMsg, clientList, leaveRoom, messages} = props

    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    const userId = useSelector((state) => state.userId)
    const [messageInput, setMessageInput] = useState('')
    let navigate = useNavigate()
    console.log(messageInput);
  //  const foundRoom = await Room.findOne({where: {roomKey}})
    // let navigate = useNavigate()

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
        return <p key={index}>{msg}</p>
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
          <button onClick={()=> sendMsg(messageInput)}>
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