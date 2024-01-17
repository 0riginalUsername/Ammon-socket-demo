// export default function openWs (){
//     closeConnection();
//     ws = new WebSocket('ws://localhost:5555/api/ws');
//     // console.log(WebSocket);
    
//     ws.addEventListener('error', () => {
//       setMessages([...messages,'WebSocket error']);
//     });
    
//     ws.addEventListener('open', () => {
//       setMessages([...messages,'WebSocket connection established']);
//     });
    
//     ws.addEventListener('close', () => {
//       setMessages([...messages,'WebSocket connection closed']);
//     });
    
//     ws.addEventListener('message', (msg) => {
//       const data = JSON.parse(msg.data);
//       console.log(data);
//       if(data.msg){
//         console.log('message recieved in DOM');
//         setMessages([...messages, data.msg])
//       }
//       ;
//       // console.log(data.data);
//       if(data.key){
//         let roomKey = data.key
//         // console.log(roomKey);
//         // setRoomkey([`room key is: `, roomKey])
//         setRoomKey(roomKey)
//       }

//       if(data.users){
//         // console.log(data);
//         let allClients = data.users
//         // console.log(allClients);
//         setClients(allClients)
//       }
      
      
//     })
    
    
//   }