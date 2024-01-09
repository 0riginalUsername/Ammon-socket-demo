import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import {Room} from '../../server/model.js'
 function RoomPage(){
  //  const foundRoom = await Room.findOne({where: {roomKey}})
    // let navigate = useNavigate()
   


    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    // const foundRoom = await Room.findOne({where: {roomKey}})
    // let allPlayers = foundRoom.players
    console.log(username);
    return(
        <div>
        {/* {allPlayers} */}
        <br></br>
        {username}
        <br>
        </br>
        Roomkey is: {roomKey}
        
        </div>
    )
}

export default RoomPage