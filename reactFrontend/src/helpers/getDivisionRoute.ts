import { DIVISIONS_ROUTES } from "../constants/divisionsRoutes";

export const getDivisionRoute = (depId: string) => {
    return DIVISIONS_ROUTES.find((division) => division.allowedRole === depId);
};
