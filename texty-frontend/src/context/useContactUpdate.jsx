import { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const ContactUpdationContext = createContext();

export function ContactUpdationProvider({ children }) {
    const [contactIsUpdated, setContactIsUpdated] = useState(false);

    return (
        <ContactUpdationContext.Provider value={{ contactIsUpdated, setContactIsUpdated }}>
            {children}
        </ContactUpdationContext.Provider>
    );
}

ContactUpdationProvider.propTypes = {
    children: PropTypes.any,
}
  
  
// Hook to use AuthContext
export function useContactUpdate() {
    return useContext(ContactUpdationContext);
}