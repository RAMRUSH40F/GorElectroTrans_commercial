import { merge, attach, createDomain } from "effector";
import { createGate } from "effector-react";
import { fetchAttendanceFx } from "../../api/attendanceApi";
import { IAttendance } from "../../types/Attendance";

export interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const attendanceGate = createGate<GateProps>();
export const attendanceDomain = createDomain();

export const getAttendanceFx = attach({ effect: fetchAttendanceFx });

// #region Events
export const loadingStarted = attendanceDomain.createEvent();
export const loadingEnded = attendanceDomain.createEvent();

export const searchChanged = attendanceDomain.createEvent<string>();
export const debouncedSearchChanged = attendanceDomain.createEvent<string>();
export const initialSearchChanged = attendanceDomain.createEvent<string>();

export const pageChanged = attendanceDomain.createEvent<number>();
export const paramsChanged = merge([
    debouncedSearchChanged,
    pageChanged,
    initialSearchChanged,
]);

export const addingModalOpened = attendanceDomain.createEvent();
export const addingModalClosed = attendanceDomain.createEvent();
export const editingModalOpened = attendanceDomain.createEvent<IAttendance>();
export const editingModalClosed = attendanceDomain.createEvent();

export const depIdChanged = attendanceDomain.createEvent<string>();
// #endregion

// #region State
export const $attendances = attendanceDomain.createStore<IAttendance[]>([]);
export const $isLoading = attendanceDomain.createStore<boolean>(false);
export const $isFetching = attendanceDomain.createStore<boolean>(false);
export const $error = attendanceDomain.createStore<string | null>(null);

export const $totalPages = attendanceDomain.createStore<number>(0);
export const $page = attendanceDomain.createStore<number>(1);
export const $size = attendanceDomain.createStore<number>(5);
export const $search = attendanceDomain.createStore<string>("");

export const $isAddingModalActive =
    attendanceDomain.createStore<boolean>(false);
export const $isEditingModalActive =
    attendanceDomain.createStore<boolean>(false);
export const $editingAttendance =
    attendanceDomain.createStore<IAttendance | null>(null);

export const $depId = attendanceDomain.createStore<string | null>(null);
// #endregion
