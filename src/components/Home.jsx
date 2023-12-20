import { useState } from 'react'  
import React from 'react'

export default function Home() {
  const [clientList, setClientList] = useState([])
  const [messages, setMessages] = useState([])
  
  let ws
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
        console.log(msg);
        const data = JSON.parse(msg.data);
        setMessages([...messages, data.message])
    })
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
      <ul>{mappedClients}</ul>
      <div>{mappedMessages}</div>
    </main>
  )
}
