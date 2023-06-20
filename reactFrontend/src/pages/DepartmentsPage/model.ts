import { merge, attach, createDomain, sample } from "effector";
import { createGate } from "effector-react";
import { IDepartment, TDepartmentDto } from "models/Department";
import departmentApi from "shared/api/departmentsApi";
import { AbortParams } from "shared/api/types";

export const departmentsGate = createGate<string>();
const domain = createDomain();

export const loadingStarted = domain.createEvent();
export const loadingEnded = domain.createEvent();
export const depIdChanged = domain.createEvent<string>();

export const $departments = domain.createStore<IDepartment[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);
export const $depId = domain.createStore<string>("");

export const getDepartmentsFx = attach({
    effect: departmentApi.fetchFx,
});

export const addDepartmentFx = attach({
    effect: departmentApi.postFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<TDepartmentDto>, depId) {
        return { depId, data, controller };
    },
});

export const updateDepartmentFx = attach({
    effect: departmentApi.putFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<IDepartment>, depId) {
        return { depId, data, controller };
    },
});

export const removeDepartmentFx = attach({
    effect: departmentApi.deleteFx,
    source: $depId,
    mapParams({ controller, data }: AbortParams<number>, depId) {
        return { depId, data, controller };
    },
});

const fetchStarted = merge([
    getDepartmentsFx.pending,
    addDepartmentFx.pending,
    updateDepartmentFx.pending,
    removeDepartmentFx.pending,
]);

// Set department id when accessing page
sample({
    clock: departmentsGate.open,
    source: departmentsGate.state,
    fn: (depId) => depId,
    target: depIdChanged,
});

// Fetch attendance data once when component is mounted
sample({
    clock: [
        departmentsGate.open,
        removeDepartmentFx.done,
        addDepartmentFx.done,
    ],
    source: $depId,
    fn: (depId) => ({ controller: new AbortController(), depId, data: null }),
    filter: (depId) => depId !== "",
    target: getDepartmentsFx,
});

// Cancel fetch request when component is unmounted
sample({
    clock: departmentsGate.close,
    source: getDepartmentsFx,
}).watch(({ controller }) => controller.abort());

// Set loading state when data is fetching
sample({
    clock: getDepartmentsFx.pending,
    source: $departments,
    filter: (departments) => departments.length === 0,
    target: loadingStarted,
});

// Set loading state when request is finished
sample({
    clock: getDepartmentsFx.finally,
    target: loadingEnded,
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(departmentsGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$departments
    .on(getDepartmentsFx.doneData, (_, data) => data)
    .on(updateDepartmentFx.doneData, (departments, data) =>
        departments.map((dep) => {
            if (dep.id === data.id) {
                return { ...dep, ...data };
            }
            return dep;
        })
    );

$error
    .on(getDepartmentsFx, () => null)
    .on(getDepartmentsFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    );

$depId.on(depIdChanged, (_, id) => id);
