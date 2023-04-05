import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    closeModal: () => void;
};

const ModalHeader: React.FC<Props> = ({ children, closeModal }) => {
    return (
        <header className="modal-header">
            <h3 className="modal-header__title">{children}</h3>
            <button className="modal-header__close-btn" type="button" onClick={closeModal}>
                <svg
                    className="modal-header__close-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                >
                    <path d="M11 0.7H13V23.3H11z" transform="rotate(-45.001 12 12)" />
                    <path d="M0.7 11H23.3V13H0.7z" transform="rotate(-45.001 12 12)" />
                </svg>
            </button>
        </header>
    );
};

export default ModalHeader;
