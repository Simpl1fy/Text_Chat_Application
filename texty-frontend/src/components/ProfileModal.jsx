import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function ProfileModal({ open, handleModal }) {

  return (
    <>
      <Dialog open={open} handler={handleModal}>
        <DialogHeader>Profile</DialogHeader>
        <DialogBody>
          <div>
            This is going to be profile content
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
