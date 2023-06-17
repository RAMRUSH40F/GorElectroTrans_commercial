import { merge, attach, createDomain, sample } from "effector";
import { debounce } from "patronum";
import { createGate } from "effector-react";
import attendanceApi from "shared/api/attendanceApi";
import { IAttendance, AttendanceId, AttendanceDto } from "models/Attendance";
import { AbortParams } from "shared/api";

interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const attendanceGate = createGate<GateProps>();
const attendanceDomain = createDomain();

export const getAttendanceFx = attach({
    effect: attendanceApi.fetchFx,
});

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
    effect: attendanceApi.postFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<AttendanceDto>, depId) {
        return { depId, data, controller };
    },
});

export const updateAttendanceFx = attach({
    effect: attendanceApi.putFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<AttendanceDto>, depId) {
        return { depId, data, controller };
    },
});

export const removeAttendanceFx = attach({
    effect: attendanceApi.deleteFx,
    source: $depId,
    mapParams({ controller, data }: AbortParams<AttendanceId>, depId) {
        return {
            depId,
            data,
            controller,
        };
    },
});

const fetchStarted = merge([
    getAttendanceFx.pending,
    addAttendanceFx.pending,
    updateAttendanceFx.pending,
    removeAttendanceFx.pending,
]);

// Set department id when accessing page
sample({
    clock: attendanceGate.open,
    source: attendanceGate.state,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Set search value from url search params when component is mounted
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

// Set page value from url search params when component is mounted
sample({
    clock: attendanceGate.open,
    source: attendanceGate.state,
    fn: ({ page }) => page,
    filter: ({ page }) => page !== $page.defaultState,
    target: pageChanged,
});

// Fetch attendance data once when component is mounted
sample({
    clock: attendanceGate.open,
    source: { depId: $depId, page: $page, size: $size, search: $search },
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
    }),
    filter: ({ search, page, depId }) =>
        search === $search.defaultState &&
        page === $page.defaultState &&
        depId !== "",
    target: getAttendanceFx,
});

// Cancel fetch request when component is unmounted
sample({
    clock: attendanceGate.close,
    source: getAttendanceFx,
}).watch(({ controller }) => controller.abort());

// Cancel fetch request when search or page change
sample({
    clock: paramsChanged,
    source: getAttendanceFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Decrease page when the last attendance on the page was deleted
sample({
    clock: removeAttendanceFx.done,
    source: { attendances: $attendances, page: $page },
    filter: ({ attendances, page }) => attendances.length === 1 && page > 1,
    fn: ({ page }) => page - 1,
    target: pageChanged,
});

// Fetch attendance when search params were changed or attendance was deleted or updated
sample({
    clock: [paramsChanged, removeAttendanceFx.done, addAttendanceFx.done],
    source: { depId: $depId, page: $page, size: $size, search: $search },
    filter: ({ depId }) => depId !== "",
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
    }),
    target: getAttendanceFx,
});

// Set loading state when data is fetching
sample({
    clock: getAttendanceFx.pending,
    source: $attendances,
    filter: (attendances) => attendances.length === 0,
    target: loadingStarted,
});

// Set loading state when request is finished
sample({
    clock: getAttendanceFx.finally,
    target: loadingEnded,
});

// Reset all stores when component unmountes
attendanceDomain.onCreateStore(($store) => {
    $store.reset(attendanceGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$error
    .on(getAttendanceFx, () => null)
    .on(getAttendanceFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    );

$attendances
    .on(getAttendanceFx.doneData, (_, { attendances }) => attendances)
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
    });

$totalPages.on(getAttendanceFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page).reset(debouncedSearchChanged);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$depId.on(depIdChanged, (_, id) => id);
