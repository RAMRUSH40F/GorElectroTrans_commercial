import { attach, createDomain, merge, sample } from "effector";
import { createGate } from "effector-react";
import { debounce } from "patronum";

import { AttendanceDto, AttendanceId, IAttendance } from "models/Attendance";

import attendanceApi from "shared/api/attendanceApi";
import { AbortParams } from "shared/api/types";

interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const attendanceGate = createGate<GateProps>();
const domain = createDomain();

// #region Events
export const loadingStarted = domain.createEvent();
export const loadingEnded = domain.createEvent();

export const searchChanged = domain.createEvent<string>();
export const debouncedSearchChanged = domain.createEvent<string>();
export const initialSearchChanged = domain.createEvent<string>();

export const pageChanged = domain.createEvent<number>();
export const paramsChanged = merge([
    debouncedSearchChanged,
    pageChanged,
    initialSearchChanged,
]);

export const depIdChanged = domain.createEvent<string>();
// #endregion

// #region Stores
export const $attendances = domain.createStore<IAttendance[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

export const $totalPages = domain.createStore<number>(0);
export const $page = domain.createStore<number>(1);
export const $size = domain.createStore<number>(20);
export const $search = domain.createStore<string>("");

export const $depId = domain.createStore<string>("");
// #endregion

export const getAttendanceFx = attach({
    effect: attendanceApi.fetchFx,
});

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

// Stop loading state when request completes
sample({
    clock: getAttendanceFx.done,
    target: loadingEnded,
});

// Stop loading state when request fails
sample({
    clock: getAttendanceFx.failData,
    filter: ({ isCanceled }) => !isCanceled,
    target: loadingEnded,
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(attendanceGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$error
    .on(getAttendanceFx, () => null)
    .on(getAttendanceFx.failData, (_, error) =>
        error.isCanceled ? null : error.message,
    );

$attendances
    .on(getAttendanceFx.doneData, (_, { data }) => data)
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
