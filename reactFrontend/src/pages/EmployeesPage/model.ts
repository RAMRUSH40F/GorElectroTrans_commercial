import { merge, attach, createDomain, sample } from "effector";
import { debounce } from "patronum";
import { createGate } from "effector-react";
import { IEmployee } from "models/Employee";
import employeeApi from "shared/api/employeesApi";
import { AbortParams } from "shared/api/types";

interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const employeesGate = createGate<GateProps>();
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
export const $employees = domain.createStore<IEmployee[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

export const $totalPages = domain.createStore<number>(0);
export const $page = domain.createStore<number>(1);
export const $size = domain.createStore<number>(5);
export const $search = domain.createStore<string>("");

export const $depId = domain.createStore<string>("");
// #endregion

export const getEmployeesFx = attach({
    effect: employeeApi.fetchFx,
});

export const addEmployeeFx = attach({
    effect: employeeApi.postFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<IEmployee>, depId) {
        return { depId, data, controller };
    },
});

export const updateEmployeeFx = attach({
    effect: employeeApi.putFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<IEmployee>, depId) {
        return { depId, data, controller };
    },
});

export const removeEmployeeFx = attach({
    effect: employeeApi.deleteFx,
    source: $depId,
    mapParams({ controller, data }: AbortParams<string>, depId) {
        return {
            depId,
            data,
            controller,
        };
    },
});

const fetchStarted = merge([
    getEmployeesFx.pending,
    addEmployeeFx.pending,
    updateEmployeeFx.pending,
    removeEmployeeFx.pending,
]);

// Set department id when accessing page
sample({
    clock: employeesGate.open,
    source: employeesGate.state,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Set search value from url search params when component is mounted
sample({
    clock: employeesGate.open,
    source: employeesGate.state,
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
    clock: employeesGate.open,
    source: employeesGate.state,
    fn: ({ page }) => page,
    filter: ({ page }) => page !== $page.defaultState,
    target: pageChanged,
});

// Fetch attendance data once when component is mounted
sample({
    clock: employeesGate.open,
    source: { depId: $depId, page: $page, size: $size, search: $search },
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
    }),
    filter: ({ search, page, depId }) =>
        search === $search.defaultState &&
        page === $page.defaultState &&
        depId !== "",
    target: getEmployeesFx,
});

// Cancel fetch request when component is unmounted
sample({
    clock: employeesGate.close,
    source: getEmployeesFx,
}).watch(({ controller }) => controller.abort());

// Cancel fetch request when search or page change
sample({
    clock: paramsChanged,
    source: getEmployeesFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Decrease page when the last employee on the page was deleted
sample({
    clock: removeEmployeeFx.done,
    source: { employees: $employees, page: $page },
    filter: ({ employees, page }) => employees.length === 1 && page > 1,
    fn: ({ page }) => page - 1,
    target: pageChanged,
});

// // Fetch employees when search params were changed or employee was deleted or updated
sample({
    clock: [paramsChanged, removeEmployeeFx.done, addEmployeeFx.done],
    source: { depId: $depId, page: $page, size: $size, search: $search },
    filter: ({ depId }) => depId !== "",
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
    }),
    target: getEmployeesFx,
});

// Set loading state when data is fetching
sample({
    clock: getEmployeesFx.pending,
    source: $employees,
    filter: (employees) => employees.length === 0,
    target: loadingStarted,
});

// Set loading state when request is finished
sample({
    clock: getEmployeesFx.finally,
    target: loadingEnded,
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(employeesGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$error
    .on(getEmployeesFx, () => null)
    .on(getEmployeesFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    );

$employees
    .on(getEmployeesFx.doneData, (_, { data }) => data)
    .on(updateEmployeeFx.doneData, (employees, data) =>
        employees.map((employee) => {
            if (employee.studentId === data.studentId) {
                return { ...employee, ...data };
            }
            return employee;
        })
    );

$totalPages.on(getEmployeesFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page).reset(debouncedSearchChanged);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$depId.on(depIdChanged, (_, id) => id);
