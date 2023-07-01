import { FC } from "react";
import { ProviderProps } from "./EffectorProvider";
import { RouterWrapperProps } from "./RouterWrapper";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "effector-react";

type Props = ProviderProps & RouterWrapperProps;

const TestWrapper: FC<Props> = ({
    initialPath = "/",
    scope,
    children,
}) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <Provider value={scope}>{children}</Provider>
        </MemoryRouter>
    );
};

export default TestWrapper;
