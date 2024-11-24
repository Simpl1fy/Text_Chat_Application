import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useModal } from '../context/MondalContext';
import AddContactModal from './AddContactModal';
import { useNavigate } from 'react-router-dom';
import { Alert } from "@material-tailwind/react";

export default function Contact() {

  const { localToken, isLoggedIn } = useAuth();
  const { isModalOpen, toggleModal } = useModal();
  
  const [resText, setResText] = useState('');
  const [responseResult, setResponseResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
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
  }, [isUpdated, localToken, isLoggedIn]);

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
  }, [showAlert])

  return (
    <div className='h-dvh relative'>
      {
        showAlert && (
          responseResult ?
          (
            <Alert open={showAlert} onClose={() => setShowAlert(false)} variant='outlined' color='green'>
              {resText}
            </Alert>
          ) : (
            <Alert open={showAlert} onClose={() => setShowAlert(false)} variant='outlined' color='red'>
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
        <ul className='overflow-y-auto'>
          {
            filteredContacts.map((contact) => (
              <li key={contact._id} className="p-3 mb-2 bg-slate-300 mx-4 rounded-lg hover:cursor-pointer" onClick={() => handleItemClick(contact._id, contact.name, contact.email)}>
                <p className='font-bold text-xl'>{contact.name}</p>
                <p>{contact.email}</p>
              </li>
            ))
          }
        </ul>
        <div className='absolute bottom-4 right-2 hover:cursor-pointer' onClick={toggleModal}>
          <AddCircleIcon fontSize='large' />
        </div>
        <AddContactModal isModalOpen={isModalOpen} toggleModal={toggleModal} setIsUpdated={setIsUpdated} setResText={setResText} setResponseResult={setResponseResult} setShowAlert={setShowAlert} />
    </div>
  )
}
