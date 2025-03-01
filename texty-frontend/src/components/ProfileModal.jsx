import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import axios from "axios";
import { useAuth } from "../context/useAuth";

export default function ProfileModal({ open, handleModal }) {

  const [profileData, setProfileData] = useState({});

  const { localToken, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProfileData = async() => {
      try {
        const res = await axios.get('http://localhost:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${localToken}`
          }
        })
        if(res.data.success) {
          setProfileData(res.data.data);
        }
      } catch(err) {
        console.log("An error occured while fetching profile data:", err);
      }
    }
    if(isLoggedIn) {
      console.log("Profile data will be fetched!");
      fetchProfileData();
    }
  }, []);

  useEffect(() => {
    console.log("Profile Data: ", profileData);
  }, [profileData]);

  return (
    <>
      <Dialog open={open} handler={handleModal}>
        <DialogHeader>Profile</DialogHeader>
        <DialogBody className="w-full px-3 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl">
          {/* Profile Picture */}
          <div className="flex justify-center mb-[2.5rem]">
            <img
              src={profileData.profilePictureURL}
              className="size-40 rounded-full object-cover"
            />
          </div>
          <div className="text-black flex flex-row items-center mb-[1rem]">
            <div className="mr-[1.75rem]">
              <PersonOutlineIcon />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Name</span>
              <span className="text-stone-700">{profileData.name}</span>
            </div>
          </div>
          <div className="text-black flex flex-row items-center mb-[1rem]">
            <div className="mr-[1.75rem]">
              <MailOutlineIcon />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Email</span>
              <span className="text-stone-700">{profileData.email}</span>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleModal}>Close</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

ProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
};
