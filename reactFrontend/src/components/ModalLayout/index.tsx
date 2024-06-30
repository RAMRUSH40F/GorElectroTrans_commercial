import { ReactNode, forwardRef } from "react";

import cn from "classnames";

import Container from "../Container";

import styles from "./styles.module.scss";

type Props = {
    children: ReactNode;
    className?: string;
    id?: string;
};

const ModalLayout = forwardRef<HTMLDivElement, Props>(
    ({ children, className, id }, ref) => {
        return (
            <div className={cn(styles.modal, className)}>
                <Container>
                    <div className={styles.wrapper}>
                        <div ref={ref} className={styles.body} id={id}>
                            {children}
                        </div>
                    </div>
                </Container>
            </div>
        );
    },
);

export default ModalLayout;
