import React from 'react'
import { useSelector } from 'react-redux'

function Room(){
    
    const roomKey = useSelector((state) => state.key)
    const clients = useSelector((state) => state.clients)
    
    console.log(clients);
    return(
        <div>
        
        Roomkey is: {roomKey}
        
        </div>
    )
}

export default Room