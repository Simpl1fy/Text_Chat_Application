import { useLocation } from "react-router-dom"

export default function Chat() {

  const location = useLocation();
  const data = location.state;

  return (
    <>
      {/* Navbar of the chat page */}
      <nav className="w-full p-4 bg-white shadow-md flex items-center justify-between">
        {data.userName} - {data.userEmail}
      </nav>
    </>
  )
}
