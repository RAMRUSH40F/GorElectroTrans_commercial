import React from "react";
import Container from "../../Container";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const ModalLayout = React.forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
    return (
        <div className="modal-layout">
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
