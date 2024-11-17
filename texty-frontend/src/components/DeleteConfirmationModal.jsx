import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import PropTypes from "prop-types";


export default function DeleteConfirmationModal({ open, handleOpen, deleteFunction }) {
  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Are you sure you want to delete chat?</DialogHeader>
        <DialogBody>This is unrecoverable</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="green"
            onClick={handleOpen}
          >
            Cancel
          </Button>
          <Button
            variant="text"
            color="red"
            onClick={deleteFunction}
          >
            Yes, I am sure
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}


DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  deleteFunction: PropTypes.func.isRequired,
};