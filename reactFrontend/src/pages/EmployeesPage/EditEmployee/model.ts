import { attach, createDomain, sample } from "effector";
import { NOTICE, showNoticeFx } from "helpers/notice";
import { IEmployee } from "models/Employee";
import { IDepartment } from "models/Department";
import departmentApi from "shared/api/departmentsApi";
import {
    $depId,
    pageClosed,
    removeEmployeeFx,
    updateEmployeeFx,
} from "../model/employeesModel";

const domain = createDomain();

export const errorReset = domain.createEvent();

export const modalOpened = domain.createEvent<IEmployee>();
export const modalClosed = domain.createEvent();

export const confirmingClosed = domain.createEvent();
export const confirmingOpened = domain.createEvent();
export const movedToConfirm = domain.createEvent();
export const confirmButtonClicked = domain.createEvent();

export const $departments = domain.createStore<IDepartment[]>([]);
export const $isLoading = domain.createStore<boolean>(true);
export const $depError = domain.createStore<string | null>(null);
export const $error = domain.createStore<string | null>(null);
export const $isDisabled = domain.createStore<boolean>(false);

export const $isModalActive = domain.createStore<boolean>(false);
export const $editingEmployee = domain.createStore<IEmployee | null>(null);

export const $isConfirming = domain.createStore<boolean>(false);


const getDepartmentsFx = attach({ effect: departmentApi.fetchFx });

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

// Set an attendance for editing
sample({
    clock: modalOpened,
    target: $editingEmployee,
});

// Move to confirm modal window when delete button was clicked
sample({
    clock: movedToConfirm,
    target: [errorReset, confirmingOpened],
});

// Delete attendance when confirm button was clicked
sample({
    clock: confirmButtonClicked,
    source: $editingEmployee,
    filter: (employee: IEmployee | null): employee is IEmployee =>
        employee !== null,
    fn: ({ studentId }) => ({
        data: studentId,
        controller: new AbortController(),
    }),
    target: removeEmployeeFx,
});

// Cancel delete request when modal was closed
sample({
    clock: pageClosed,
    source: removeEmployeeFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Show notice and close modal window when attendance was successfully updated
sample({
    clock: updateEmployeeFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Изменения успешно сохранены",
    }),
    target: [showNoticeFx, modalClosed],
});

// Cancel update request when modal was closed
sample({
    clock: pageClosed,
    source: updateEmployeeFx,
}).watch(({ controller }) => {
    controller.abort();
});

// show notice and close modal window when attendance was successfully deleted
sample({
    clock: removeEmployeeFx.doneData,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно удалена" }),
    target: [showNoticeFx, modalClosed],
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(pageClosed, modalClosed, modalOpened);
});

$isLoading.on(getDepartmentsFx.pending, (_, pending) => pending);

$departments.on(getDepartmentsFx.doneData, (_, data) => data);

$depError.on(getDepartmentsFx.failData, (_, { isCanceled, message }) =>
    isCanceled ? null : message
);

$error
    .on([updateEmployeeFx.failData, removeEmployeeFx.failData], (_, error) =>
        error.isCanceled ? null : error.message
    )
    .reset(errorReset, updateEmployeeFx, removeEmployeeFx);

$isDisabled.on(removeEmployeeFx.pending, (_, pending) => pending);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);

$editingEmployee.reset(modalClosed);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, modalClosed, removeEmployeeFx], () => false);
