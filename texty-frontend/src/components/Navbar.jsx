import { Outlet, Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export default function Navbar() {
  return (
    <>
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-between items-center">
        <div className="flex flex-row justify-start items-center p-4">
          <p className="text-white text-2xl me-5">Texty</p>
          <div className="border border-white rounded-lg">
            <button className="bg-inherit text-white hover:bg-white/10 h-full p-3">Add a Contact</button>
            <Link to="https://github.com/Simpl1fy" className="bg-inherit text-white hover:bg-white/10 h-full p-3">About Me</Link>
          </div>
        </div>
        <div className="me-5">
          <Button>Signup</Button>
        </div>
      </div>
      <Outlet />
    </>
  )
}
