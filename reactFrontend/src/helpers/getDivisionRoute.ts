import { DIVISIONS_ROUTES } from "pages/DivisionsPage/divisionsRoutes";

export const getDivisionRoute = (depId: string) => {
    return DIVISIONS_ROUTES.find((division) => division.allowedRole === depId);
};
