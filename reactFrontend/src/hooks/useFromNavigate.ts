import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";

export const useFromNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (to: string, options?: NavigateOptions) => navigate(to, { state: { from: location }, replace: true, ...options });
};
