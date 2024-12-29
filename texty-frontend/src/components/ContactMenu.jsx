import { MenuList, MenuItem } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export default function ContactMenu() {

  return (
    <MenuList>
      <MenuItem className=''>Delete Contact</MenuItem>
    </MenuList>
  )
}

ContactMenu.propTypes = {
  position: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};