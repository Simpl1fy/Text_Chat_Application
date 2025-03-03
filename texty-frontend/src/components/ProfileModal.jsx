import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Spinner } from "@material-tailwind/react";
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Camera from "../icons/Camera";
import TrashBin from "../icons/TrashBin";
import axios from "axios";
import { useAuth } from "../context/useAuth";

export default function ProfileModal({ open, handleModal }) {

  const [profileData, setProfileData] = useState({});

  const { localToken, isLoggedIn } = useAuth();

  // file input reference
  const fileInputRef = useRef(null);

  // loading state
  const [loading, setLoading] = useState(false);

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
      console.log("Profile Data is going to be fetched")
      fetchProfileData();
    }
  }, [open]);

  const getImageSrc = (name) => {
    if(profileData.profilePictureURL === "") {
      console.log(name);
      const nameSplit = name.split(" ");
      return `https://ui-avatars.com/api?name=${nameSplit[0]}+${nameSplit[1]}`;
    } else {
      return profileData.profilePictureURL;
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current.click();
  }

  const handleFileUpload = async(event) => {
    setLoading(true);
    const file = event.target.files[0];
    if(!file) {
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await axios.post('http://localhost:5000/user/update_profile_picture', formData, {
        headers: {
          Authorization: `Bearer ${localToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      if(res.data.success) {
        console.log("Profile Picture Updated Successfully");
        setProfileData((prev) => ({
          ...prev,
          "profilePictureURL": res.data.data
        }))
        setLoading(false);
      }
    } catch(err) {
      console.log("An error occured while updating profile picture =", err);
      setLoading(false);
    }
  }

  const handleFileRemove = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/user/remove_profile_picture', {}, {
        headers: {
          Authorization: `Bearer ${localToken}`
        }
      })
      if(res.data.success) {
        console.log("Profile Picture Removed Successfully");
        setProfileData((prev) => ({
          ...prev,
          "profilePictureURL": ""
        }))
        setLoading(false);
      }
    } catch(err) {
      console.log("An error occured while removing profile picture =", err);
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} handler={handleModal}>
        <DialogHeader>Profile</DialogHeader>
        <DialogBody className="	w-full px-3 mx-auto md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl">
          {/* Profile Picture */}
          <div className="flex justify-center mb-[2.5rem]">
            <div className="size-40 rounded-full bg-gray-100 flex justify-center items-center">
              {loading ?
                <Spinner color="blue" className="h-12 w-12" />
                :
                <>
                  <img
                    src={getImageSrc(profileData.name)}
                    alt="Profile Picture"
                    className="size-40 rounded-full object-cover"
                  />
                </>
              }
            </div>
          </div>
          <div
            className="flex justify-center mb-[1.75rem] gap-[1rem]"
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <label htmlFor="contained-button">
              <Button 
                variant="gradient"
                onClick={handleFileSelect}
              >
                <div className="flex items-center justify-center">
                  <div className="me-1">
                    <Camera />
                  </div>
                  Update
                </div>
              </Button>
            </label>
            <Button
              variant="gradient"
              color="red"
              onClick={handleFileRemove}
            >
              <div className="flex items-center justify-center">
                <div className="me-1">
                  <TrashBin />
                </div>
                Remove
              </div>
            </Button>
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
