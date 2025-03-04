import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Button,
} from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

  
export default function AddContactModal({ isModalOpen, toggleModal, setResText, setResponseResult, setShowAlert }) {

  const { localToken } = useAuth();

  const [searchEmail, setSearchEmail] = useState('');
  const [result, setResult] = useState([]);

  const handleModalClose = () => {
    setResult([]);
    toggleModal();
  }

  const handleEmailChange = (e) => {
    let text = e.target.value;
    setSearchEmail(text);
    console.log(searchEmail);
  }

  useEffect(() => {

    if(!searchEmail) {
      setResult([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/user/search_email",
          { searchTerm: searchEmail },
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          }
        );
        setResult(res.data);
      } catch (err) {
        console.error("An error occurred while fetching search results:", err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchEmail, localToken]);


  const handleUserClick = async (contactId) => {
    try {
      const res = await axios.post('http://localhost:5000/user/add_contact/create_notification',
        { receiverId: contactId },
        {
          headers: {
            Authorization: `Bearer ${localToken}`
          }
        }
      )
      console.log(res.data);
      if(res.data.success) {
        setResponseResult(true);
        setResText(res.data.message);
      } else {
        setResponseResult(false);
        setResText(res.data.error);
      }
      setShowAlert(true);
      toggleModal();
      setResult([]);
    } catch(err) {
      console.error("An error occured while adding contact =", err);
    }
  }

  const getProfilePicture = (ppURL, name) => {
    if(ppURL.length !== 0) {
      return ppURL;
    } else {
      const nameSplit = name.split(" ");
      return `https://ui-avatars.com/api?name=${nameSplit[0]}+${nameSplit[1]}`
    }
  }

  return (
    <>
      <Dialog open={isModalOpen}>
        <DialogHeader>Add a Contact</DialogHeader>
        <DialogBody>
          <Typography
            variant='small'
            color='blue-gray'
            className="mb-1 font-medium"
          >
            Enter Email Address
          </Typography>
          <Input
            placeholder='johnbrandy@gmail.com'
            className="appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            onChange={handleEmailChange}
          />
          <ul>
            {result.map((user) => (
              <li key={user._id} className='w-100 my-1 p-2 bg-gray-100 border-2 rounded-lg hover:cursor-pointer' onClick={() => handleUserClick(user._id)}>
                <div className='flex flex-row items-center'>
                  <img
                    src={getProfilePicture(user.profilePictureURL, user.name)}
                    alt='Profile Picture'
                    className='w-10 h-10 rounded-full object-cover me-2'
                  />
                  <div>
                    <div className='font-bold text-stone-900 text-lg'>
                      {user.email}
                    </div>
                    <div>
                      {user.name}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={handleModalClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

AddContactModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setResText: PropTypes.func,
  setResponseResult: PropTypes.func,
  setShowAlert: PropTypes.func,
};
