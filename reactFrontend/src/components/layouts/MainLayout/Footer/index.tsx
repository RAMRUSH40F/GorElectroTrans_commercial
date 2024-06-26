import React from "react";

import Container from "components/Container";

import logoSrc from "assets/img/logo-footer.svg";

import styles from "./styles.module.scss";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <img src={logoSrc} alt="Logo" />
            </Container>
        </footer>
    );
};

export default Footer;
