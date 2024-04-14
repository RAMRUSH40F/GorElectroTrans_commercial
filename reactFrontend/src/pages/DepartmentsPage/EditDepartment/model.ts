import { createDomain, sample } from "effector";

import { NOTICE, showNoticeFx } from "helpers/notice";

import { IDepartment } from "models/Department";

import {
    departmentsGate,
    removeDepartmentFx,
    updateDepartmentFx,
} from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();

export const modalOpened = domain.createEvent<IDepartment>();
export const modalClosed = domain.createEvent();

export const confirmingClosed = domain.createEvent();
export const confirmingOpened = domain.createEvent();
export const movedToConfirm = domain.createEvent();
export const confirmButtonClicked = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isDisabled = domain.createStore<boolean>(false);

export const $isModalActive = domain.createStore<boolean>(false);
export const $editingDepartment = domain.createStore<IDepartment | null>(null);

export const $isConfirming = domain.createStore<boolean>(false);

// Set an attendance for editing
sample({
    clock: modalOpened,
    target: $editingDepartment,
});

// Move to confirm modal window when delete button was clicked
sample({
    clock: movedToConfirm,
    target: [errorReset, confirmingOpened],
});

// Delete attendance when confirm button was clicked
sample({
    clock: confirmButtonClicked,
    source: $editingDepartment,
    filter: (dep: IDepartment | null): dep is IDepartment => dep !== null,
    fn: ({ id }) => ({
        data: id,
        controller: new AbortController(),
    }),
    target: removeDepartmentFx,
});

// Cancel delete request when modal was closed
sample({
    clock: departmentsGate.close,
    source: removeDepartmentFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Show notice and close modal window when attendance was successfully updated
sample({
    clock: updateDepartmentFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Изменения успешно сохранены",
    }),
    target: [showNoticeFx, modalClosed],
});

// Cancel update request when modal was closed
sample({
    clock: departmentsGate.close,
    source: removeDepartmentFx,
}).watch(({ controller }) => {
    controller.abort();
});

// show notice and close modal window when attendance was successfully deleted
sample({
    clock: removeDepartmentFx.doneData,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно удалена" }),
    target: [showNoticeFx, modalClosed],
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(departmentsGate.close, modalClosed, modalOpened);
});

$error
    .on(
        [updateDepartmentFx.failData, removeDepartmentFx.failData],
        (_, error) => (error.isCanceled ? null : error.message),
    )
    .reset(errorReset, updateDepartmentFx, removeDepartmentFx);

$isDisabled.on(removeDepartmentFx.pending, (_, pending) => pending);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);

$editingDepartment.reset(modalClosed);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, modalClosed, removeDepartmentFx], () => false);
