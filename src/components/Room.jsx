import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// import {Room} from '../../server/model.js'
function RoomPage(){
    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    const [clientList, setClientList] = useState([])
    let navigate = useNavigate()
  //  const foundRoom = await Room.findOne({where: {roomKey}})
    // let navigate = useNavigate()
    const getClients = async () => {
        // console.log(roomKey);
        let res =  await axios.post('http://localhost:5555/api/clients', {roomKey})
        console.log(res.data);
        let allClients = res.data.foundRoom
        setClientList(allClients)
        console.log(clientList);
    }
    useEffect(() => {
        getClients()
        axios.get('/api/check')
        .then(res => {
          if(!res.data.success){
            navigate('/')
          }
        })
      },[])

    // const foundRoom = await Room.findOne({where: {roomKey}})
    // let allPlayers = foundRoom.players
    
    return(
        <div>
        <button onClick={()=>getClients()}>getClients</button>
        <br></br>
        {username}
        <br>
        </br>
        Roomkey is: {roomKey}
        
        </div>
    )
}

export default RoomPage