import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Room(){
    let navigate = useNavigate()
    useEffect(() => {
        if(!username){
          navigate('/')
        }
      },[])


    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    const username = useSelector((state) => state.username)
    console.log(username);
    return(
        <div>
        {username}
        <br>
        </br>
        Roomkey is: {roomKey}
        
        </div>
    )
}

export default Room