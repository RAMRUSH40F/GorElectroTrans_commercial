import { ReactNode, forwardRef } from "react";
import Container from "../Container";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    children: ReactNode;
    className?: string;
};

const ModalLayout = forwardRef<HTMLDivElement, Props>(
    ({ children, className }, ref) => {
        return (
            <div className={cn(styles.modal, className)}>
                <Container>
                    <div className={styles.wrapper}>
                        <div ref={ref} className={styles.body}>
                            {children}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
);

export default ModalLayout;
