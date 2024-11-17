import { useLocation } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import { Button } from "@material-tailwind/react"
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import axios from "axios";

export default function Chat() {

  const location = useLocation();
  const data = location.state;

  const [ws, setWs] = useState(null);           // Storing the websocket object
  const [message, setMessage] = useState('');   // For storing the current message written by the user.
  const [messages, setMessages] = useState([]); // stores all the messages in an array

  const [isOpen, setIsOpen] = useState(false);


  const { localToken } = useAuth();
  const [activeRoom, setActiveRoom] = useState();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post("http://localhost:5000/chat/room", {
          otherUserId: data.receiverId
        }, {
          headers: {
            Authorization: `Bearer ${localToken}`
          }
        });
        console.log(response.data);
        setActiveRoom(response.data);

      } catch(err) {
        console.error("Error while fetching the room =", err);
      }
    }
    fetchRooms();
  }, [localToken]);

  useEffect(() => {
    console.log("Useeffect for updating chat messages is running");
    const fetchMessages = async() => {
      try {
        const res = await axios.get("http://localhost:5000/chat/fetch", {
          params: {
            roomId: activeRoom.room_id
          }
        });
        if(res && res.data) {
          setMessages(prevMessages => [...prevMessages, ...res.data]);
        } else {
          console.log("Error: Response did not contain any messages");
        }
      } catch(err) {
        console.error("An error occured while fetching messages from the server =", err);
      }
    }
    
    let timer = setTimeout(() => {
      if(activeRoom) {
        fetchMessages();
      }else {
        console.log("activeRoom is not set yet");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [localToken, activeRoom]);


  useEffect(() => {
    let socket = null;
    if(activeRoom) {
      socket = new WebSocket(`ws://localhost:5000?token=${localToken}&roomId=${activeRoom.room_id}`)
      setWs(socket);
      socket.onmessage = (event) => {
        console.log(event.data);
        try {
          const newMessage = JSON.parse(event.data);
          if(newMessage && newMessage.type === 'connection') {
            console.log(newMessage.message);
          } else {
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
        } catch(err) {
          console.error("An error occured during onmessage event =", err);
        }
      };

      socket.onclose = () => {
        console.log("Websocket connection closed");
      }
    }

    return () => {
      if(ws) {
        ws.close();
      }
    }
  }, [activeRoom, localToken]);

  const sendMessage = () => {
    if(activeRoom && ws && message.trim()) {
      ws.send(message);
      setMessage('');
    }
  }

  const handleChatDelete = async () => {
    console.log(activeRoom.room_id);
    let roomId = activeRoom.room_id;
    try {
      const res = await axios.post("http://localhost:5000/chat/delete", {
          roomId: roomId
        }, {
          headers: {
            Authorization: `Bearer ${localToken}`
          }
        }
      );
      console.log(res.data);
      if(res.data.success) {
        setMessages([]);
      }
    } catch(err) {
      console.log("An error occured while deleting chat =", err);
    }
    toggleModal();
  }

  const handleChatDeleteButton = () => {
    toggleModal();
  }

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col h-dvh">
      {/* Navbar of the chat page */}
      <div className="w-full p-4 bg-white shadow-md flex justify-between">
        <div>
          <span className="text-xl font-bold">{data.userName}</span> -
          <span className="ms-0.5 text-lg font-medium">{data.userEmail}</span>
        </div>
        <div>
          <Button onClick={handleChatDeleteButton}>Delete Chat</Button>
          <DeleteConfirmationModal open={isOpen} handleOpen={toggleModal} deleteFunction={handleChatDelete} />
        </div>
      </div>
      {/* Chat */}
      <div className="flex-grow">
        <ul className="list-none">
          {messages.map((msg, index) => (
            <li key={index} className="border rounded-lg p-2 my-2 ms-2 break-words md:w-6/12 bg-lime-100 drop-shadow-md">{msg}</li>
          ))}
        </ul>
      </div>
      {/* Text input */}
      <div className="bg-slate-200 p-4 flex">
        <input placeholder="Enter text here" className="w-full p-2 rounded-lg flex-grow me-2" onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }} />
        <div className="rounded-full flex justify-center items-center p-3 bg-white" onClick={sendMessage}>
          <SendIcon />
        </div>
      </div>
    </div>
  )
}
