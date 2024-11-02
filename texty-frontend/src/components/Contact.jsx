import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

export default function Contact() {

  const { localToken } = useAuth();

  const [contacts, setContacts] = useState([])

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

    fetchContacts();
  }, [localToken]);

  return (
    <div>
      <nav className="py-3.5 px-4 bg-white shadow-md mb-2">
          <div className="flex  items-center rounded-lg border-2 border-zinc-600 bg-sky-50">
            <div className='px-2'><SearchIcon/></div>
            <input type="text" placeholder="Search in your contacts" className="w-full h-full py-2 px-3 outline-none rounded-r-lg" />
          </div>
        </nav>
        <ul>
          {
            contacts.map((contact) => (
              <li key={contact._id} className="p-3 mb-2 bg-slate-300 mx-4 rounded-lg">
                <p className='font-bold text-xl'>{contact.name}</p>
                <p>{contact.email}</p>
              </li>
            ))
          }
        </ul>
    </div>
  )
}
