import { createDomain, sample } from "effector";
import { NOTICE, showNoticeFx } from "helpers/notice";
import { addAttendanceFx, attendanceGate } from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();
export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isModalActive = domain.createStore(false);

// Show notice when attendance was successfully added
sample({
    clock: addAttendanceFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно добавлена" }),
    target: showNoticeFx,
});

// Cancel update request when modal was closed
sample({
    clock: attendanceGate.close,
    source: addAttendanceFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, attendanceGate.close);
});

$error
    .on(addAttendanceFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    )
    .reset(errorReset, addAttendanceFx, modalClosed);

$isModalActive
    .on(modalOpened, () => true)
    .on([modalClosed, addAttendanceFx.done], () => false);
