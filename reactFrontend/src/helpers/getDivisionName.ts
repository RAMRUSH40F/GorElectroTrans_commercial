import { DIVISIONS_ROUTES } from "../constants/divisionsRoutes";

export const getDivisionName = (depId: string) => {
    return DIVISIONS_ROUTES.find((division) => division.id === depId)?.name;
};
