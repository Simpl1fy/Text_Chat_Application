import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!isModalOpen);

    return (
        <ModalContext.Provider value={{ isModalOpen, toggleModal }}>
            {children}
        </ModalContext.Provider>
    )
}

ModalProvider.propTypes = {
    children: PropTypes.any,
}