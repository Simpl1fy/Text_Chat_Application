import { Outlet, Link } from "react-router-dom";
import { 
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-between items-center p-4">
        <div className="flex items-center">
          <p className="text-white text-2xl mr-5">Texty</p>

          {/* Desktop Menu */}
          <div className="hidden md:flex border border-white rounded-lg p-2 space-x-4">
            <Button className="bg-inherit text-white hover:bg-white/10">Add a Contact</Button>
            <Button className="bg-inherit text-white hover:bg-white/10">
              <Link to="https://github.com/Simpl1fy">About Developer</Link>
            </Button>
          </div>
        </div>

        {/* User Menu & Signup Button */}
        <div className="hidden md:flex items-center space-x-3 mr-5">
          <Button className="bg-inherit text-white hover:bg-white/10">Signup</Button>
          <Menu>
            <MenuHandler>
              <IconButton>
                <FontAwesomeIcon icon={faCircleUser} className="fa-xl text-white" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex md:hidden">
          <IconButton onClick={toggleDrawer}>
            <FontAwesomeIcon icon={faBars} className="fa-lg text-white" />
          </IconButton>
        </div>

        {/* Drawer Menu */}
        <Drawer open={drawerOpen} onClose={toggleDrawer} className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="flex flex-col space-y-4">
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>Add a Contact</Button>
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>
              <Link to="https://github.com/Simpl1fy">About Developer</Link>
            </Button>
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>Profile</Button>
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>Signup</Button>
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>Logout</Button>
          </div>
        </Drawer>
      </div>
      <Outlet />
    </>
  );
}
