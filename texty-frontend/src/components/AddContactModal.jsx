import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from '@material-tailwind/react';
import PropTypes from 'prop-types';

  
export default function AddContactModal({ isModalOpen, toggleModal }) {
  return (
    <>
      <Dialog open={isModalOpen} handler={toggleModal}>
        <DialogHeader>Add a Contact</DialogHeader>
        <DialogBody>Please search the contacts</DialogBody>
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
