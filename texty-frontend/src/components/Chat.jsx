import { useLocation } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";

export default function Chat() {

  const location = useLocation();
  const data = location.state;

  const [ws, setWs] = useState(null);           // Storing the websocket object
  const [message, setMessage] = useState('');   // For storing the current message written by the user.
  const [messages, setMessages] = useState([]); // stores all the messages in an array

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket is connected');
    }

    socket.onmessage = (msg) => {
      const newMessage = JSON.parse(msg.data);
      console.log(newMessage.text);
      setMessages((prevMessages) => [...prevMessages, newMessage.text]);
    };

    socket.onerror = (err) => { console.error(err); }

    socket.onclose = () => {
      console.log("Websocket is closed");
    }
    return () => {
      if(socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws && message) {
      ws.send(message);
      setMessage('');
    }
  }

  return (
    <div className="flex flex-col h-dvh">
      {/* Navbar of the chat page */}
      <nav className="w-full p-4 bg-white shadow-md">
        <span className="text-xl font-bold">{data.userName}</span> - 
        <span className="ms-0.5 text-lg font-medium">{data.userEmail}</span>
      </nav>
      {/* Chat */}
      <div className="flex-grow">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      {/* Text input */}
      <div className="bg-slate-200 p-4 flex">
        <input placeholder="Enter text here" className="w-full p-2 rounded-lg font-semibold flex-grow me-2" onChange={(e) => setMessage(e.target.value)} value={message} />
        <div className="rounded-full flex justify-center items-center p-3 bg-white" onClick={sendMessage  }>
          <SendIcon />
        </div>
      </div>
    </div>
  )
}
