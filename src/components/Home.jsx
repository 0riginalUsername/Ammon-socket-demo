import { useState } from 'react'  
import React from 'react'


let ws
export default function Home() {
  const [clientList, setClientList] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  function closeConnection() {
    if (!!ws) {
      ws.close();
    }
  }
  
  const openWs = () => {
    closeConnection();
    
    ws = new WebSocket('ws://localhost:5555/api/ws');
    
    ws.addEventListener('error', () => {
      setMessages([...messages,'WebSocket error']);
    });
    
    ws.addEventListener('open', () => {
      setMessages([...messages,'WebSocket connection established']);
    });
    
    ws.addEventListener('close', () => {
      setMessages([...messages,'WebSocket connection closed']);
    });
    
    ws.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      // console.log(data.data);
      // console.log(msg);
        setMessages([...messages, data.message])
      })
  }
  const sendMsg = () =>{
    
      if(!messageInput){
        return
      } else if (!ws) {
        setMessages([...messages, 'No Websocket connection'])
        return
      }
      ws.send({msg: JSON.stringify(messageInput)})
      console.log({msg: JSON.stringify(messageInput)});
      
    }

  const closeWs = () => {
    closeConnection()
    setMessages([...messages, 'No Websocket connection'])
  }
  
  const requestRoomCreation = () => {
   
    
    const data = {createRoom:{name: 'userinput'}
    
  }
  WebSocket.send(data)
  //Send message to websocket server to create room.
  
}


const mappedClients = clientList.map((client, index) => {
  return <li key={index}>{client}</li>
  })
  const mappedMessages = messages.map((msg, index) => {
    return <p key={index}>{msg}</p>
  })
 
  
  
  return (
    <main>
      <h1>Welcome to the chat!</h1>
      <button onClick={() => requestRoomCreation()}>Create Room</button>
      <button onClick={() => openWs()}>Open Socket</button>
      <button onClick={() => closeWs()}>Close Socket</button>
      <div className="input-block">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
          <button onClick={sendMsg}>
            Send message
          </button>
      </div>
      <div>{mappedClients}</div>
      <div>{mappedMessages}</div>
    </main>
  )
}
  
  