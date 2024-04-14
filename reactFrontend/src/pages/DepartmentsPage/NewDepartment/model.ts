import { createDomain, sample } from "effector";

import { NOTICE, showNoticeFx } from "helpers/notice";

import { addDepartmentFx, departmentsGate } from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();
export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isModalActive = domain.createStore(false);

// Show notice when department was successfully added
sample({
    clock: addDepartmentFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно добавлена" }),
    target: showNoticeFx,
});

// Cancel update request when modal window was closed
sample({
    clock: departmentsGate.close,
    source: addDepartmentFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, departmentsGate.close);
});

$error
    .on(addDepartmentFx.failData, (_, error) =>
        error.isCanceled ? null : error.message,
    )
    .reset(errorReset, addDepartmentFx, modalClosed);

$isModalActive
    .on(modalOpened, () => true)
    .on([modalClosed, addDepartmentFx.done], () => false);
