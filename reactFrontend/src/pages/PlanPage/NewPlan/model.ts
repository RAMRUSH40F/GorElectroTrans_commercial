import { createDomain, sample } from "effector";
import { NOTICE, showNoticeFx } from "helpers/notice";
import { addPlanFx, planGate } from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();
export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isModalActive = domain.createStore(false);

// Show notice when plan was successfully added
sample({
    clock: addPlanFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно добавлена" }),
    target: showNoticeFx,
});

// Cancel update request when modal window was closed
sample({
    clock: planGate.close,
    source: addPlanFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, planGate.close);
});

$error
    .on(addPlanFx.failData, (_, error) =>
        error.isCanceled ? null : error.message
    )
    .reset(errorReset, addPlanFx, modalClosed);

$isModalActive
    .on(modalOpened, () => true)
    .on([modalClosed, addPlanFx.done], () => false);
