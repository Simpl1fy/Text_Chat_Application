import PropTypes from "prop-types";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button
} from "@material-tailwind/react";

export default function EditProfileModal({ open, handleOpen }) {
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          Account Preferences
        </DialogHeader>
        <DialogBody>
          This modal is used for changing user data
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={handleOpen}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired
}