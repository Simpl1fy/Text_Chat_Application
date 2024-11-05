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

  
export default function AddContactModal({ isModalOpen, toggleModal }) {

  const [searchEmail, setSearchEmail] = useState('');
  const [result, setResult] = useState([]);

  const handleEmailChange = (e) => {
    let text = e.target.value;
    setSearchEmail(text);
    console.log(searchEmail);
  }

  useEffect(() => {
    if (searchEmail) {
      const searchFunction = async() => {
        try {
          const res = await axios.post('http://localhost:5000/user/search_email', {
            searchTerm: searchEmail
          })
          console.log(res.data);
          setResult(res.data);
        } catch(err) {
          console.error("An error occured while fetching search results:", err);
        }
      }
      searchFunction();
    }
  }, [searchEmail]);

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
              <li key={user.id}>{user.name} - {user.email}</li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={toggleModal}
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
};
