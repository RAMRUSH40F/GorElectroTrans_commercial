import React from "react";
import Container from "../../../Container";
import logoSrc from "../../../../assets/img/logo-footer.svg";

import "./styles.scss";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <Container>
                <img className="footer__logo" src={logoSrc} alt="Logo" />
            </Container>
        </footer>
    );
};

export default Footer;
