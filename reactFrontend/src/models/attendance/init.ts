import { sample } from "effector";
import {
    $attendances,
    $depId,
    $editingAttendance,
    $error,
    $isAddingModalActive,
    $isEditingModalActive,
    $isFetching,
    $isLoading,
    $page,
    $search,
    $size,
    $totalPages,
    attendanceGate,
    addingModalClosed,
    addingModalOpened,
    debouncedSearchChanged,
    depIdChanged,
    editingModalClosed,
    editingModalOpened,
    getAttendanceFx,
    initialSearchChanged,
    loadingEnded,
    loadingStarted,
    pageChanged,
    paramsChanged,
    searchChanged,
    attendanceDomain,
} from ".";
import { debounce } from "patronum";

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

// Setting an attendance for editing
sample({
    clock: editingModalOpened,
    source: editingModalOpened,
    target: $editingAttendance,
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(getAttendanceFx.pending, (_, pending) => pending);

$error
    .on(getAttendanceFx, () => null)
    .on(getAttendanceFx.failData, (_, error) => {
        console.log(error);
        return error.message;
    });

$attendances.on(getAttendanceFx.doneData, (_, { attendances }) => attendances);

$totalPages.on(getAttendanceFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$isAddingModalActive
    .on(addingModalOpened, () => true)
    .on(addingModalClosed, () => false);

$isEditingModalActive
    .on(editingModalOpened, () => true)
    .on(editingModalClosed, () => false);

$editingAttendance.on(editingModalClosed, () => null);

$depId.on(depIdChanged, (_, id) => id);
