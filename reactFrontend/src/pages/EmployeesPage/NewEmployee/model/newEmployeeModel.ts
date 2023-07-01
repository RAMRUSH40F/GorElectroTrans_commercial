import { attach, createDomain, sample } from "effector";
import { NOTICE, showNoticeFx } from "helpers/notice";
import { $depId, addEmployeeFx, pageClosed } from "../../model/employeesModel";
import { IDepartment } from "models/Department";
import departmentApi from "shared/api/departmentsApi";

const domain = createDomain();

export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();
export const errorReset = domain.createEvent();

export const $departments = domain.createStore<IDepartment[]>([]);
export const $isLoading = domain.createStore<boolean>(true);
export const $depError = domain.createStore<string | null>(null);
export const $error = domain.createStore<string | null>(null);
export const $isModalActive = domain.createStore(false);

export const getDepartmentsFx = attach({ effect: departmentApi.fetchFx });

// Fetch departments when modal window opens
sample({
    clock: modalOpened,
    source: $depId,
    fn: (depId) => ({ depId, controller: new AbortController(), data: null }),
    target: getDepartmentsFx,
});

// Cancel fetch departments request when modal window closes
sample({
    clock: modalClosed,
    source: getDepartmentsFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Show notice when employee was successfully added
sample({
    clock: addEmployeeFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Работник успешно добавлен" }),
    target: showNoticeFx,
});

// Cancel update request when employees page was closed
sample({
    clock: pageClosed,
    source: addEmployeeFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, pageClosed);
});

$isLoading.on(getDepartmentsFx.pending, (_, pending) => pending);

$departments.on(getDepartmentsFx.doneData, (_, data) => data);

$depError
    .on(getDepartmentsFx.failData, (_, { message, isCanceled }) =>
        isCanceled ? null : message
    )
    .reset(modalClosed);

$error
    .on(addEmployeeFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    )
    .reset(errorReset, addEmployeeFx, modalClosed);

$isModalActive
    .on(modalOpened, () => true)
    .on([modalClosed, addEmployeeFx.done], () => false);
