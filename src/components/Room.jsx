import useState from 'react'
import { useSelector } from 'react-redux'

function Room(){
    
    const roomKey = useSelector((state) => state.key)
    
    return(
        <div>
            {roomKey}
        dogs are cool 
        </div>
    )
}

export default Room