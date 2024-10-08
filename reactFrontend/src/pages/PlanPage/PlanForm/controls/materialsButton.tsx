import { FC } from "react";

import ActionButton from "components/ActionButton";

import { usePlanFormContext } from "../context";

interface MaterialsButtonProps {
    className?: string;
}

export const MaterialsButton: FC<MaterialsButtonProps> = ({ className }) => {
    const {
        state: { plan, isDisabled },
        actions: { handleOpenMaterials },
    } = usePlanFormContext();

    if (!plan) return null;

    return (
        <ActionButton
            className={className}
            onClick={(event) =>
                handleOpenMaterials(event, plan.lessonContent, plan.id)
            }
            disabled={isDisabled}
            type="button"
            colorType="info"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 50 50"
                viewBox="0 0 50 50"
                id="workbook"
            >
                <path d="M47.2 5.9h-2.9V4.4c0-.4-.2-.7-.5-.9C38 .4 30.8.3 25 3.3c-5.8-3-13-2.9-18.7.2C5.9 3.7 5.7 4 5.7 4.4v1.5H2.8C1.8 5.9 1 6.7 1 7.7v26.2c0 1 .8 1.8 1.8 1.8 9.8 0 18.5 0 44.3 0 1 0 1.8-.8 1.8-1.8V7.7C49 6.7 48.2 5.9 47.2 5.9zM42.3 5v1.9c0 0 0 0 0 0s0 0 0 0v22.6C35.8 29.9 31 30.6 26 33.1V5C31 2.5 37.2 2.5 42.3 5zM7.7 5C12.8 2.5 19 2.5 24 5v28.1c-5-2.4-9.8-3.2-16.3-3.6V5zM3 7.9h2.7v22.6c0 .5.4 1 1 1 5.5.3 9.7.8 13.7 2.2H3V7.9zM47 33.7H29.6c4.1-1.5 8.2-2 13.7-2.2.5 0 1-.5 1-1V7.9H47V33.7zM48.8 41.7c0-1.8-1.5-3.3-3.3-3.3h-4.6H10.7c0 0 0 0 0 0-.4 0-.9.3-9.1 4.4-.7.4-.7 1.4 0 1.8 9.2 4.4 8.7 4.4 9.1 4.4 0 0 0 0 0 0l0 0 0 0c8.8 0 26 0 34.8 0 1.8 0 3.3-1.5 3.3-3.3V41.7zM39.9 40.4v2.3H11.7v-2.3H39.9zM9.7 41v5.3l-5.4-2.7L9.7 41zM11.7 44.6h28.2v2.3H11.7V44.6zM46.8 45.6c0 .7-.6 1.3-1.3 1.3h-3.6v-6.5h3.6c.7 0 1.3.6 1.3 1.3V45.6z"></path>
            </svg>
            Конспекты
        </ActionButton>
    );
};
