import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// import {Room} from '../../server/model.js'
function RoomPage(props){
    const {sendMsg, clientList: initialClients, leaveRoom} = props

    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)

    const [clientList, setClientList] = useState(initialClients)
    const [messageInput, setMessageInput] = useState('')
    let navigate = useNavigate()
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
      console.log(clientList);

      
    // const foundRoom = await Room.findOne({where: {roomKey}})
    // let allPlayers = foundRoom.players
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
          <button onClick={sendMsg}>
            Send message
          </button>
      </div>
        <br></br>
        {username}
        <br>
        </br>
        Roomkey is: {roomKey}
        <button onClick={leaveRoom({})}>Leave Room</button>
        </div>
    )
}

export default RoomPage