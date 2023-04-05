import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IMaterial } from "../../models/Material";

interface MaterialsState {
    materials: IMaterial[];
    setMaterials: Dispatch<SetStateAction<IMaterial[]>>;
    addMaterial: (newMaterial: IMaterial) => void;
    deleteMaterial: (fileName: string) => void;
}

export const MaterialsContext = createContext<MaterialsState>({} as MaterialsState);
export const useMaterialsContext = () => useContext(MaterialsContext);
