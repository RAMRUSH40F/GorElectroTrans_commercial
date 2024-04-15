import { attach, combine, createDomain, merge, sample } from "effector";
import { createGate } from "effector-react";
import { debounce } from "patronum";

import { SortOrder } from "components/SortButton";

import { transformSortToString } from "helpers/transformSortToString";

import { IEmployee } from "models/Employee";

import employeeApi from "shared/api/employeesApi";
import { AbortParams } from "shared/api/types";

interface Sort {
    name: SortOrder;
    subdepartment: SortOrder;
}

interface GateProps {
    depId: string;
    search: string;
    page: number;
}

export const employeesGate = createGate<GateProps>();
const domain = createDomain();

// #region Events
export const pageLoaded = employeesGate.open;
export const pageClosed = employeesGate.close;

export const loadingStarted = domain.createEvent();
export const loadingEnded = domain.createEvent();

export const searchChanged = domain.createEvent<string>();
export const debouncedSearchChanged = domain.createEvent<string>();
export const initialSearchChanged = domain.createEvent<string>();
export const sortToggled = domain.createEvent<keyof Sort>();
export const pageChanged = domain.createEvent<number>();

export const paramsChanged = merge([
    debouncedSearchChanged,
    pageChanged,
    initialSearchChanged,
    sortToggled,
]);

export const depIdChanged = domain.createEvent<string>();
// #endregion

// #region Stores
export const $employees = domain.createStore<IEmployee[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

export const $depId = domain.createStore<string>("");
export const $totalPages = domain.createStore<number>(0);
export const $page = domain.createStore<number>(1);
export const $size = domain.createStore<number>(20);
export const $search = domain.createStore<string>("");
export const $sort = domain.createStore<Sort>({
    name: "disabled",
    subdepartment: "disabled",
});

const $params = combine({
    depId: $depId,
    search: $search,
    page: $page,
    size: $size,
    sort: $sort,
});
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

export const fetchStarted = merge([
    getEmployeesFx.pending,
    addEmployeeFx.pending,
    updateEmployeeFx.pending,
    removeEmployeeFx.pending,
]);

// Set department id when page was mounted
sample({
    clock: pageLoaded,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Set search value from url search params when page was mounted
sample({
    clock: pageLoaded,
    fn: ({ search }) => search,
    filter: ({ search }) => search !== $search.defaultState,
    target: initialSearchChanged,
});

// Change search value after 250ms from last searchChanged invocation
debounce({
    source: searchChanged,
    target: debouncedSearchChanged,
    timeout: 250,
});

// Set page value from url search params when page was mounted
sample({
    clock: pageLoaded,
    fn: ({ page }) => page,
    filter: ({ page }) => page !== $page.defaultState,
    target: pageChanged,
});

// Fetch attendance data once when component was mounted
sample({
    clock: pageLoaded,
    source: $params,
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
        sort: transformSortToString({ ...params.sort }),
    }),
    filter: ({ search, page, depId }) =>
        search === $search.defaultState &&
        page === $page.defaultState &&
        depId !== "",
    target: getEmployeesFx,
});

// Cancel fetch request when component is unmounted
sample({
    clock: pageClosed,
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
    source: $params,
    filter: ({ depId }) => depId !== "",
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
        sort: transformSortToString({ ...params.sort }),
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

// Stop loading state when request completes
sample({
    clock: getEmployeesFx.done,
    target: loadingEnded,
});

// Stop loading state when request fails
sample({
    clock: getEmployeesFx.failData,
    filter: ({ isCanceled }) => !isCanceled,
    target: loadingEnded,
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(pageClosed);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$error
    .on(getEmployeesFx, () => null)
    .on(getEmployeesFx.failData, (_, error) =>
        error.isCanceled ? null : error.message,
    );

$employees
    .on(getEmployeesFx.doneData, (_, { data }) => data)
    .on(updateEmployeeFx.doneData, (employees, data) =>
        employees.map((employee) => {
            if (employee.studentId === data.studentId) {
                return { ...employee, ...data };
            }
            return employee;
        }),
    );

$totalPages.on(getEmployeesFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page).reset(debouncedSearchChanged);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$sort.on(sortToggled, (sort, property) => {
    switch (sort[property]) {
        case "disabled":
            return { ...sort, [property]: "desc" };
        case "desc":
            return { ...sort, [property]: "asc" };
        default:
            return { ...sort, [property]: "disabled" };
    }
});

$depId.on(depIdChanged, (_, id) => id);
