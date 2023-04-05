import React from "react";
import Container from "../../Container";
import cn from "classnames";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const ModalLayout = React.forwardRef<HTMLDivElement, Props>(({ children, className }, ref) => {
    return (
        <div className={cn("modal-layout", className)}>
            <Container>
                <div className="modal-layout__wrapper">
                    <div ref={ref} className="modal-layout__body">
                        {children}
                    </div>
                </div>
            </Container>
        </div>
    );
});

export default ModalLayout;
