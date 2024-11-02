import { createContext, useState, useContext, useEffect} from "react";
import PropTypes from "prop-types";

const MobileContext = createContext();

export function MobileProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

MobileProvider.propTypes = {
  children: PropTypes.any,
}

export function useIsMobile() {
  return useContext(MobileContext);
}