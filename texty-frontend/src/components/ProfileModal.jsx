import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
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
      fetchProfileData();
    }
  }, []);

  return (
    <>
      <Dialog open={open} handler={handleModal}>
        <DialogHeader>Profile</DialogHeader>
        <DialogBody>
          <div className="">
            Name - {profileData.name}
          </div>
          <div>
            Email - {profileData.email}
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
