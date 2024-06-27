import { attach, combine, createDomain, sample } from "effector";
import { createGate } from "effector-react";
import { debounce } from "patronum";

import { IEmployee } from "models/Employee";

import employeeApi from "shared/api/employeesApi";

interface GateProps {
    depId: string;
}

export const employeeSearchGate = createGate<GateProps>();

const domain = createDomain();

// Events
export const loadingStarted = domain.createEvent();
export const loadingEnded = domain.createEvent();

export const searchChanged = domain.createEvent<string>();
export const debouncedSearchChanged = domain.createEvent<string>();

export const depIdChanged = domain.createEvent<string>();

// Stores
export const $employees = domain.createStore<IEmployee[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);
export const $isSuccess = combine(
    $isLoading,
    $error,
    (isLoading: boolean, error: string | null) => !isLoading && !error,
);

export const $search = domain.createStore<string>("");
export const $debouncedSearch = domain.createStore("");
export const $size = domain.createStore<number>(5);
export const $depId = domain.createStore<string>("");

// Effects
export const getEmployeeByNameFx = attach({
    effect: employeeApi.fetchByNameFx,
});

// Set department id when accessing page
sample({
    clock: employeeSearchGate.open,
    source: employeeSearchGate.state,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Change search value after 250ms when user stopped typing
debounce({
    source: searchChanged,
    target: debouncedSearchChanged,
    timeout: 250,
});

// Clear employees list when search value is empty
sample({
    clock: searchChanged,
    source: { search: $search },
    filter: ({ search }) => search === "",
    fn: () => [],
    target: $employees,
});

// Cancel request if search was changed or closed
sample({
    clock: [debouncedSearchChanged, employeeSearchGate.close],
    source: getEmployeeByNameFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Fetch employees on search change
sample({
    clock: debouncedSearchChanged,
    source: { depId: $depId, size: $size, search: $search },
    filter: ({ depId, search }) => depId !== "" && search !== "",
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
    }),
    target: getEmployeeByNameFx,
});

// Set loading state when employees data is fetching
sample({
    clock: getEmployeeByNameFx.pending,
    source: $employees,
    filter: (employees) => employees.length === 0,
    target: loadingStarted,
});

// Stop loading state when request completes
sample({
    clock: getEmployeeByNameFx.done,
    target: loadingEnded,
});

// Stop loading state when request fails
sample({
    clock: getEmployeeByNameFx.failData,
    filter: ({ isCanceled }) => !isCanceled,
    target: loadingEnded,
});

// Reset all stores when component unmounts
domain.onCreateStore(($store) => {
    $store.reset(employeeSearchGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(getEmployeeByNameFx.pending, (_, pending) => pending);

$error
    .on(getEmployeeByNameFx.failData, (_, error) =>
        error.isCanceled ? null : error.message,
    )
    .reset([getEmployeeByNameFx, debouncedSearchChanged]);

$employees.on(getEmployeeByNameFx.doneData, (_, data) => data);

$search.on(searchChanged, (_, value) => value);

$debouncedSearch.on(debouncedSearchChanged, (_, value) => value);

$depId.on(depIdChanged, (_, id) => id);
