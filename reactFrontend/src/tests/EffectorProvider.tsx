import { FC, ReactNode } from "react";
import { Scope } from "effector";
import { Provider } from "effector-react";

export interface ProviderProps {
    scope: Scope;
    children: ReactNode;
}

const EffectorProvider: FC<ProviderProps> = ({ scope, children }) => {
    return <Provider value={scope}>{children}</Provider>;
};

export default EffectorProvider;
