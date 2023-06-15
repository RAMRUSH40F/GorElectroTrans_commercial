import { merge, attach, createDomain, sample } from "effector";
import { createGate } from "effector-react";
import { fetchAttendanceFx } from "shared/api/attendanceApi/fetchAttendance";
import {
    IAttendance,
    IAttendanceCredentials,
    TAttendanceDto,
} from "models/Attendance";
import { debounce } from "patronum";
import { postAttendanceFx } from "shared/api/attendanceApi/postAttendance";
import { putAttendanceFx } from "shared/api/attendanceApi/putAttendance";
import { deleteAttendanceFx } from "shared/api/attendanceApi/deleteAttendance";

export interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const attendanceGate = createGate<GateProps>();
const attendanceDomain = createDomain();

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

export const depIdChanged = attendanceDomain.createEvent<string>();
// #endregion

// #region Stores
export const $attendances = attendanceDomain.createStore<IAttendance[]>([]);
export const $isLoading = attendanceDomain.createStore<boolean>(false);
export const $isFetching = attendanceDomain.createStore<boolean>(false);
export const $error = attendanceDomain.createStore<string | null>(null);

export const $totalPages = attendanceDomain.createStore<number>(0);
export const $page = attendanceDomain.createStore<number>(1);
export const $size = attendanceDomain.createStore<number>(5);
export const $search = attendanceDomain.createStore<string>("");

export const $depId = attendanceDomain.createStore<string>("");
// #endregion

export const addAttendanceFx = attach({
    effect: postAttendanceFx,
    source: $depId,
    mapParams(attendanceResult: TAttendanceDto, depId) {
        return { depId, attendanceResult };
    },
});

export const updateAttendanceFx = attach({
    effect: putAttendanceFx,
    source: $depId,
    mapParams(attendanceResult: TAttendanceDto, depId) {
        return { depId, attendanceResult };
    },
});

export const removeAttendanceFx = attach({
    effect: deleteAttendanceFx,
    source: $depId,
    mapParams(attendanceCredentials: IAttendanceCredentials, depId) {
        return { depId, attendanceCredentials };
    },
});

// Reset all stores when component unmountes
attendanceDomain.onCreateStore(($store) => {
    $store.reset(attendanceGate.close);
});

// Set department id when accessing page
sample({
    clock: attendanceGate.open,
    source: attendanceGate.state,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Setting search value from url search params when component is mounted
sample({
    clock: attendanceGate.open,
    source: attendanceGate.state,
    fn: ({ search }) => search,
    filter: ({ search }) => search !== $search.defaultState,
    target: initialSearchChanged,
});

// Change search value after 250ms when user stopped typing
debounce({
    source: searchChanged,
    target: debouncedSearchChanged,
    timeout: 250,
});

// Setting page value from url search params when component is mounted
sample({
    clock: attendanceGate.open,
    source: attendanceGate.state,
    fn: ({ page }) => page,
    filter: ({ page }) => page !== $page.defaultState,
    target: pageChanged,
});

// Fetching attendances data once when component is mounted
sample({
    clock: attendanceGate.open,
    source: { depId: $depId, page: $page, size: $size, search: $search },
    fn: (params) => ({ ...params, controller: new AbortController() }),
    filter: ({ search, page }) =>
        search === $search.defaultState && page === $page.defaultState,
    target: getAttendanceFx,
});

// Canceling request when component is unmounted
sample({
    clock: [attendanceGate.close],
    source: getAttendanceFx,
}).watch(({ controller }) => controller.abort());

// Canceling request when search or page change
sample({
    clock: paramsChanged,
    source: getAttendanceFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Fetching attendances data when search or page change
sample({
    clock: paramsChanged,
    source: { depId: $depId, page: $page, size: $size, search: $search },
    fn: (params) => ({ ...params, controller: new AbortController() }),
    target: getAttendanceFx,
});

// Setting loading state when data is fetching
sample({
    clock: getAttendanceFx.pending,
    source: $attendances,
    filter: (attendances) => attendances.length === 0,
    target: loadingStarted,
});

// Setting loading state when request is finished
sample({
    clock: getAttendanceFx.finally,
    target: loadingEnded,
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(getAttendanceFx.pending, (_, pending) => pending);

$error
    .on(getAttendanceFx, () => null)
    .on(getAttendanceFx.failData, (_, error) => error.message);

updateAttendanceFx.doneData.watch((data) => console.log(data));

$attendances
    .on(getAttendanceFx.doneData, (_, { attendances }) => attendances)
    .on(addAttendanceFx.doneData, (attendances, data) => [data, ...attendances])
    .on(updateAttendanceFx.doneData, (attedances, data) => {
        return attedances.map((attendance) => {
            if (
                attendance.lessonId === data.lessonId &&
                attendance.studentId === data.studentId
            ) {
                return { ...attendance, ...data };
            }
            return attendance;
        });
    })
    .on(removeAttendanceFx, (attendances, { lessonId, studentId }) => {
        return attendances.filter(
            (attendance) =>
                attendance.lessonId !== lessonId ||
                attendance.studentId !== studentId
        );
    });

$totalPages.on(getAttendanceFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$depId.on(depIdChanged, (_, id) => id);
