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
import { Alert } from "@material-tailwind/react";
import ExclamationIcon from '../icons/ExclamationIcon';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContactMenu from './ContactMenu';

export default function Contact() {

  const { localToken, isLoggedIn } = useAuth();
  const { isModalOpen, toggleModal } = useModal();
  const { resText, setResText, showAlert, setShowAlert, responseResult, setResponseResult } = useAlert();
  const { contactIsUpdated } = useContactUpdate();
  
  const [contacts, setContacts] = useState([]);
  // const [isUpdated, setIsUpdated] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // context for menu opening
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedContactId, setSelectedContactId] = useState(null);

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


  // function for handling right click
  const handleRightClick = (event, contactId) => {
    event.preventDefault();
  
    // Get the bounding rectangle of the clicked <li>
    const boundingRect = event.currentTarget.getBoundingClientRect();
    
    setMenuPosition({
      x: event.clientX - boundingRect.left, // X relative to <li>
      y: event.clientY - boundingRect.top,  // Y relative to <li>
    });

    setSelectedContactId(contactId);
    setShowMenu(true);
  };

  const handleOutsideClick = () => {
    setShowMenu(false);
    setSelectedContactId(null);
  }

  useEffect(() => {
    console.log(showMenu);
    console.log(selectedContactId);
    console.log(menuPosition)
  }, [selectedContactId, showMenu, menuPosition]);

  return (
    <div
      className='h-screen relative flex flex-col'
      onClick={handleOutsideClick}
    >
      {
        showAlert && (
          responseResult ?
          (
            <Alert icon={<ExclamationIcon />} open={showAlert} onClose={() => setShowAlert(false)} variant='gradient' color='green'>
              {resText}
            </Alert>
          ) : (
            <Alert icon={<FontAwesomeIcon icon={faXmark} />} open={showAlert} onClose={() => setShowAlert(false)} variant='gradient' color='red'>
              {resText}
            </Alert>
          )
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
                  onContextMenu={(event) => handleRightClick(event, contact._id)}
                  onClick={() => handleItemClick(contact._id, contact.name, contact.email)}
                >
                  {/* Contact Info */}
                  <div>
                    <p className='font-bold text-xl'>{contact.name}</p>
                    <p>{contact.email}</p>
                  </div>
                  {showMenu && selectedContactId === contact._id && 
                    (
                      <ContactMenu position={menuPosition} show={showMenu} />
                    )
                  }
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
