

export default function ChatRoom(props){

    return(
        <div className="input-block">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
          <button onClick={props.sendMsg}>
            Send message
          </button>
      </div>
    )
}
