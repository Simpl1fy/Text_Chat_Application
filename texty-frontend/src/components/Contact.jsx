import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useModal } from '../context/MondalContext';
import { useAlert } from '../context/useAlert';
import { useContactUpdate } from '../context/useContactUpdate';
import AddContactModal from './AddContactModal';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import CheckMark from '../icons/CheckMark';
import XMark from '../icons/XMark';
import ThreeDots from '../icons/ThreeDots';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react"

export default function Contact() {

  const { localToken, isLoggedIn } = useAuth();
  const { isModalOpen, toggleModal } = useModal();
  const { resText, setResText, showAlert, setShowAlert, responseResult, setResponseResult } = useAlert();
  const { contactIsUpdated, setContactIsUpdated } = useContactUpdate();
  
  const [contacts, setContacts] = useState([]);
  // const [isUpdated, setIsUpdated] = useState(false);
  const [searchInput, setSearchInput] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async() => {
      try {
        const res = await axios.get('http://localhost:5000/user/contacts', {
          headers: {
            Authorization: `Bearer ${localToken}`,
          }
        });
        setContacts(res.data);
      } catch(err) {
        console.log(err);
      }
    };

    if(isLoggedIn) {
      fetchContacts();
    } else {
      setContacts([]);
    }
  }, [contactIsUpdated, localToken, isLoggedIn]);

  const handleItemClick = (userId, userName, userEmail) => {
    navigate(`/chat/${userId}`, { state: { receiverId: userId, userName: userName, userEmail: userEmail } });
  }

  const filteredContacts = contacts.filter(
    (contact) => 
      contact.email.includes('gmail.com') && 
      (contact.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchInput.toLowerCase()))
  );

  // Setting auto close for alert
  useEffect(() => {
    let timer = setTimeout(() => {
      if(showAlert) {
        setShowAlert(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showAlert, setShowAlert]);


  const handleDeleteClick = async (event, contactId) => {
    event.stopPropagation();
    console.log("Delete clicked");

    try {
      const res = await axios.post("http://localhost:5000/user/delete/contact", {
        contactId: contactId,
      }, {
        headers: {
          Authorization: `Bearer ${localToken}`,
        }
      });
      if(res.data.success === true) {
        console.log("Contact Deleted Successfully");
        setResText(res.data.message);
        setResponseResult(true);
        setShowAlert(true);
        setContactIsUpdated(!contactIsUpdated);
      } else {
        console.log("Failed to delete contact");
        setResText(res.data.message);
        setResponseResult(false);
        setShowAlert(true);
      }
    } catch(err) {
      console.log("An error occured while deleting contact =", err);
    }
  }

  const getProfilePicture = (profilePictureURL, name) => {
    const nameSplit = name.split(" ");
    if(profilePictureURL === "") {
      return `https://ui-avatars.com/api?name=${nameSplit[0]}+${nameSplit[1]}`;
    } else {
      return profilePictureURL;
    }
  }

  return (
    <div
      className='h-screen relative flex flex-col'
    >
      {
        showAlert && (
          <Toast className='absolute top-0 right-2 w-50'>
            {responseResult ? 
              (
                <div className="text-green-500 bg-green-100 p-2 rounded-xl me-2 shrink-0">
                  <CheckMark />
                </div>
              )
              :
              (
                <div className="text-red-500 bg-red-100 p-2 rounded-lg me-2 shrink-0">
                  <XMark />
                </div>
              )
            }
            <div>{resText}</div>
            <Toast.Toggle onDismiss={() => setShowAlert(false)} />
          </Toast>
        )
      }
      <nav className="py-3.5 px-4 bg-white shadow-md mb-2">
          <div className="flex  items-center rounded-lg border-2 border-zinc-600 Ebg-sky-50">
            <div className='px-2'><SearchIcon/></div>
            <input type="text" placeholder="Search in your contacts" className="w-full h-full py-2 px-3 outline-none rounded-r-lg" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
            />
          </div>
        </nav>
        <div className="overflow-y-auto flex-grow relative">
          <ul>
            {
              filteredContacts.map((contact) => (
                <li 
                  key={contact._id} className="p-3 mb-2 bg-slate-300 mx-4 rounded-lg hover:cursor-pointer group flex justify-between"
                  onClick={() => handleItemClick(contact._id, contact.name, contact.email)}
                >
                  {/* Contact Info */}
                  <div className='flex flex-row items-center'>
                    {/* image */}
                    <div className='me-[1.25rem]'>
                      <img
                        src={getProfilePicture(contact.profilePictureURL, contact.name)}
                        className='size-10 rounded-full object-cover'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold text-lg'>{contact.name}</span>
                      <span className='text-stone-700'>{contact.email}</span>
                    </div>
                  </div>
                  <Menu>
                    <MenuHandler>
                      <Button variant='text' size='sm' className='rounded-full'>
                        <ThreeDots/>
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem 
                        className='bg-red-100 hover:bg-red-200'
                        onClick={(event) => handleDeleteClick(event, contact._id)}
                      >
                        Delete Contact
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </li>
              ))
            }
          </ul>
        </div>
        <div className='absolute bottom-4 right-2 hover:cursor-pointer' onClick={toggleModal}>
          <AddCircleIcon fontSize='large' />
        </div>
        <AddContactModal isModalOpen={isModalOpen} toggleModal={toggleModal} setResText={setResText} setResponseResult={setResponseResult} setShowAlert={setShowAlert} />
    </div>
  )
}
