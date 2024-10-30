import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localToken, setLocalToken] = useState('');

  useEffect(() => {
      const token = localStorage.getItem('token');
      if(token) {
          setIsLoggedIn(true);
          setLocalToken(token);
      }
  }, []);

  // function declarations
  const signup = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setIsLoggedIn(true);
    setLocalToken(jwtToken);
  }
  
  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setIsLoggedIn(true);
    setLocalToken(jwtToken);
  }


  const signout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLocalToken('');
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, localToken, signup, login, signout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Assigning prop types
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}


// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
