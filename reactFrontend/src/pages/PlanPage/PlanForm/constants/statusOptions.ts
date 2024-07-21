import { DropdownOption } from "components/formElements/Dropdown";

import { PLAN_STATUS, PLAN_STATUS_VALUE } from "models/Plan";

export type StatusDropdownOption = DropdownOption<PLAN_STATUS, string>;

export const statusOptions: StatusDropdownOption[] = [
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.PLANNED],
        value: PLAN_STATUS.PLANNED,
    },
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.HELD],
        value: PLAN_STATUS.HELD,
    },
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.RESCHEDULED],
        value: PLAN_STATUS.RESCHEDULED,
    },
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.CANCELLED],
        value: PLAN_STATUS.CANCELLED,
    },
];
