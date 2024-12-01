import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [resText, setResText] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    return (
        <AlertContext.Provider value={{ resText, setResText, showAlert, setShowAlert }}>
          {children}
        </AlertContext.Provider>
      );
}

AlertProvider.propTypes = {
    children: PropTypes.any,
}
  
  
// Hook to use AuthContext
export function useAuth() {
return useContext(AlertContext);
}