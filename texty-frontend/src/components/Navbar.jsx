import { Outlet, Link, useNavigate } from "react-router-dom";
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
import { faCircleUser, faBars, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useIsMobile } from "../context/useIsMobile";
import { useAlert } from "../context/useAlert";
import { useModal } from "../context/MondalContext";
import { useContactUpdate } from "../context/useContactUpdate";
import AddContactModal from "./AddContactModal";
import ProfileModal from "./ProfileModal";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationArray, setNotificationArray] = useState([]);
  const [isNotificationUpdated, setIsNotificationUpdated] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const profileModalHandler = () => setIsProfileModalOpen(!isProfileModalOpen);

  const { isLoggedIn, signout, localToken } = useAuth();
  const { setResText, setShowAlert, setResponseResult } = useAlert();
  const { setContactIsUpdated } = useContactUpdate();

  const { isMobile } = useIsMobile();
  const { isModalOpen, toggleModal } = useModal();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleSignupClick = () => {
    navigate("/signup");
    if(isMobile) {
      toggleDrawer();
    }
  }

  const handleLogoutClick = () => {
    if(isMobile) {
      signout();
      toggleDrawer();
    } else {
      signout();
    }
  }

  const handleAddContactButton = () => {
    if(isMobile) {
      toggleDrawer();
      if(!isLoggedIn) {
        setResponseResult(false);
        setResText("Please login to add a contact");
        setShowAlert(true);
      } else {
        setTimeout(() => {
          toggleModal();
        }, [1000]);
      }
    }

    if(!isLoggedIn) {
      setResponseResult(false);
      setResText("Please login to add a contact");
      setShowAlert(true);
    } else {
      toggleModal();
    }
  };

  // UseEffect for fetching notifications of user
  useEffect(() => {
    const fetchNotifications = async() => {
      try{
        const res = await axios.get("http://localhost:5000/user/get_notifications",
          {
            headers: {
              Authorization: `Bearer ${localToken}`
            }
          }
        );
        console.log(res.data.notifications);
        setNotificationArray(res.data.notifications);
      } catch(err) {
        console.log("An error occured = " + err);
      }
    }
    if(localToken) {
      fetchNotifications();
    }
  }, [localToken, isNotificationUpdated]);

  const handleAcceptClick = async(senderId) => {
    try {
      const response = await axios.post("http://localhost:5000/user/add_contact/accept", {
        senderId: senderId
      }, {
        headers: {
          Authorization: `Bearer ${localToken}`
        }
      });
      console.log(response.data);
      if(response.data.success) {
        setIsNotificationUpdated(prev => !prev);
        setResText(response.data.message);
        setResponseResult(true);
        setContactIsUpdated(true);
      } else {
        setResText(response.data.error);
        setResponseResult(false);
      }
      setShowAlert(true);
    } catch(err) {
      console.log("An error occured =", err);
    }
  }

  const handleDeclineClick = async (senderId) => {
    try {
      const response = await axios.post("http://localhost:5000/user/add_contact/decline", {
        senderId: senderId
      }, {
        headers: {
          Authorization: `Bearer ${localToken}`
        }
      });

      console.log(response.data);
      if(response.data.success) {
        setIsNotificationUpdated(prev => !prev);
        setResText(response.data.message);
        setResponseResult(true);
      } else {
        setResText(response.data.error);
        setResponseResult(false);
      }
      setShowAlert(true);
    } catch(err) {
      console.log("An error occured =", err);
    }
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-between items-center p-4">
        <div className="flex items-center">
          <p className="text-white text-2xl mr-5"><Link to="/home">Texty</Link></p>

          {/* Desktop Menu */}
          <div className="hidden md:flex border border-white rounded-lg p-2 space-x-4">
            <Button className="bg-inherit text-white hover:bg-white/10" onClick={handleAddContactButton}>Add a Contact</Button>
            <Button className="bg-inherit text-white hover:bg-white/10">
              <Link to="https://github.com/Simpl1fy">About Developer</Link>
            </Button>
          </div>
        </div>

        {/* Navbar Right side */}
        <div className="flex flex-row">
          {/* Notification Menu */}
          <div className="me-2">
            <Menu>
              <MenuHandler>
                <IconButton className="bg-inherit hover:bg-white/10">
                  <FontAwesomeIcon icon={faBell} className="fa-xl" />
                </IconButton>
              </MenuHandler>
              <MenuList>
                {notificationArray.length > 0 ? 
                  (
                    notificationArray.map((notification) => (
                      <MenuItem key={notification.userId}>
                        <div className="flex justify-between items-center">
                          <div className="me-2">
                            <p className="text-base font-medium">{notification.userName}</p>
                            <p className="text-sm">{notification.userEmail}</p>
                          </div>
                          <div className="flex">
                            <IconButton variant="gradient" color="green" size="sm" className="me-1" onClick={() => handleAcceptClick(notification.userId)}>
                              <FontAwesomeIcon icon={faCheck} />
                            </IconButton>
                            <IconButton variant="gradient" color="red" size="sm" onClick={() => handleDeclineClick(notification.userId)}>
                              <FontAwesomeIcon icon={faXmark} />
                            </IconButton>
                          </div>
                        </div>
                      </MenuItem>
                    ))
                  ): 
                  (
                    <MenuItem>No notifications</MenuItem>
                  )
                }
              </MenuList>
            </Menu>
          </div>

          {/* User Menu & Signup Button */}
          <div className="hidden md:flex items-center space-x-3 mr-5">
            {!isLoggedIn ? (
              <Button className="bg-inherit text-white hover:bg-white/10" onClick={handleSignupClick}>
              Signup
              </Button>
            ) : (
              <Menu>
                <MenuHandler>
                  <IconButton className="bg-inherit hover:bg-white/10">
                    <FontAwesomeIcon icon={faCircleUser} className="fa-xl text-white" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={profileModalHandler}>Profile</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="flex md:hidden">
            <IconButton onClick={toggleDrawer} className="bg-inherit hover:bg-white/10">
              <FontAwesomeIcon icon={faBars} className="fa-lg text-white" />
            </IconButton>
          </div>
          {/* Drawer Menu */}
          <Drawer open={drawerOpen} onClose={toggleDrawer} className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="flex flex-col space-y-4">
              <Button className="bg-inherit text-white hover:bg-white/10" onClick={handleAddContactButton}>Add a Contact</Button>
              <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>
                <Link to="https://github.com/Simpl1fy">About Developer</Link>
              </Button>
              {isLoggedIn ? (
                <>
                  <Button className="bg-inherit text-white hover:bg-white/10" onClick={toggleDrawer}>Profile</Button>
                  <Button className="bg-inherit text-white hover:bg-white/10" onClick={handleLogoutClick}>Logout</Button>
                </>
                ) : (
                <Button className="bg-inherit text-white hover:bg-white/10" onClick={handleSignupClick}>Signup</Button>
              )}
            </div>
          </Drawer>
        </div>
        <AddContactModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
        <ProfileModal open={isProfileModalOpen} handleModal={profileModalHandler} />
      </div>
      <Outlet />
    </>
  );
}
