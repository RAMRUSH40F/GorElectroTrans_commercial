import React, { useState } from "react";
import { PlansContext } from ".";
import { IPlan } from "../../models/Plan";

type Props = {
    children: React.ReactNode;
};

const PlansContextProvider: React.FC<Props> = ({ children }) => {
    const [plans, setPlans] = useState<IPlan[]>([]);

    const updatePlans = (changedPlan: IPlan) => {
        setPlans((plans) =>
            plans.map((currPlan) => (currPlan.id === changedPlan.id ? { ...currPlan, ...changedPlan } : currPlan))
        );
    };

    const deletePlan = (id: number) => {
        setPlans((plans) => plans.filter((plan) => plan.id !== id));
    };

    const addPlan = (newPlan: IPlan) => {
        setPlans((plans) => [newPlan, ...plans]);
    };

    const addFile = (id: number, fileName: string) => {
        setPlans((plans) =>
            plans.map((plan) => {
                if (plan.id === id) {
                    plan.lessonContent = [fileName, ...plan.lessonContent];
                }
                return plan;
            })
        );
    };

    const deleteFile = (id: number, fileName: string) => {
        setPlans((plans) =>
            plans.map((plan) => {
                if (plan.id === id) {
                    plan.lessonContent = plan.lessonContent.filter((contentName) => contentName !== fileName);
                }
                return plan;
            })
        );
    };

    return (
        <PlansContext.Provider value={{ plans, setPlans, updatePlans, addPlan, deletePlan, addFile, deleteFile }}>
            {children}
        </PlansContext.Provider>
    );
};

export default PlansContextProvider;
