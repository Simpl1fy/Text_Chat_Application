import { useLocation } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';

export default function Chat() {

  const location = useLocation();
  const data = location.state;

  return (
    <div className="flex flex-col h-dvh">
      {/* Navbar of the chat page */}
      <nav className="w-full p-4 bg-white shadow-md">
        <span className="text-xl font-bold">{data.userName}</span> - 
        <span className="ms-0.5 text-lg font-medium">{data.userEmail}</span>
      </nav>
      {/* Chat */}
      <div className="flex-grow">
        Text area
      </div>
      {/* Text input */}
      <div className="bg-slate-500 p-4 flex">
        <input placeholder="Enter text here" className="w-full p-2 rounded-md focus:outline-0 flex-grow me-2" />
        <div className="rounded-full flex justify-center items-center p-3 bg-white">
          <SendIcon />
        </div>
      </div>
    </div>
  )
}
