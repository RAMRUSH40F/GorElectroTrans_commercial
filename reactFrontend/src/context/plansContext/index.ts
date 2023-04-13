import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IPlan } from "../../models/Plan";

interface PlansState {
    plans: IPlan[];
    setPlans: Dispatch<SetStateAction<IPlan[]>>;
    updatePlans: (changedPlan: IPlan) => void;
    addPlan: (newPlan: IPlan) => void;
    deletePlan: (id: number) => void;
    addFile: (id: number, fileName: string) => void;
    deleteFile: (id: number, fileName: string) => void;
}

export const PlansContext = createContext<PlansState>({} as PlansState);
export const usePlansContext = () => useContext(PlansContext);
