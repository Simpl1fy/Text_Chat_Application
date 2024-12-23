// import { MenuList, MenuItem, Menu } from '@material-tailwind/react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export default function ContactMenu({ position, show }) {
  
  useEffect(() => {
    console.log("Position from contact menu =",position);
    console.log("Show from contact menu is =",show);
  }, [position, show]);

  if(!show) return null;

  return (
    <div
     style ={{
      position: 'abosolute',
      top: `${position.y}px`,
      left: `${position.x}px`,
      zIndex: 1000,
     }}
    >
      <ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
      </ul>
    </div>
  )
}

ContactMenu.propTypes = {
  position: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};