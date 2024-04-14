import { FC } from "react";

import { Provider } from "effector-react";
import { MemoryRouter } from "react-router-dom";

import { ProviderProps } from "./EffectorProvider";
import { RouterWrapperProps } from "./RouterWrapper";

type Props = ProviderProps & RouterWrapperProps;

const TestWrapper: FC<Props> = ({ initialPath = "/", scope, children }) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <Provider value={scope}>{children}</Provider>
        </MemoryRouter>
    );
};

export default TestWrapper;
