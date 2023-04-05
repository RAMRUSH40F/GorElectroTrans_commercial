import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IPlan } from "../../models/Plan";

interface PlansState {
    plans: IPlan[];
    setPlans: Dispatch<SetStateAction<IPlan[]>>;
    updatePlans: (changedPlan: IPlan) => void;
    addPlan: (newPlan: IPlan) => void;
    deletePlan: (id: number) => void;
}

export const PlansContext = createContext<PlansState>({} as PlansState);
export const usePlansContext = () => useContext(PlansContext);
