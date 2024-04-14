import { createDomain, sample } from "effector";

import { NOTICE, showNoticeFx } from "helpers/notice";

import { IPlan } from "models/Plan";

import {
    modalOpened as MaterialsOpened,
    backButtonClicked,
} from "../Materials/model";
import { planGate, removePlanFx, updatePlanFx } from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();

export const modalOpened = domain.createEvent<{ plan: IPlan }>();
export const modalClosed = domain.createEvent();

export const confirmingClosed = domain.createEvent();
export const confirmingOpened = domain.createEvent();
export const movedToConfirm = domain.createEvent();
export const confirmButtonClicked = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isDisabled = domain.createStore<boolean>(false);

export const $isModalActive = domain.createStore<boolean>(false);
export const $editingPlan = domain.createStore<IPlan | null>(null);

export const $isConfirming = domain.createStore<boolean>(false);

// Set an plan for editing
sample({
    clock: modalOpened,
    fn: ({ plan }) => plan,
    target: $editingPlan,
});

// Move to confirm modal window when delete button was clicked
sample({
    clock: movedToConfirm,
    target: [errorReset, confirmingOpened],
});

// Delete plan when confirm button was clicked
sample({
    clock: confirmButtonClicked,
    source: $editingPlan,
    filter: (plan: IPlan | null): plan is IPlan => plan !== null,
    fn: (plan) => ({
        data: plan.id,
        controller: new AbortController(),
    }),
    target: removePlanFx,
});

// Cancel delete request when modal was closed
sample({
    clock: planGate.close,
    source: removePlanFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Show notice and close modal window when plan was successfully updated
sample({
    clock: updatePlanFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Изменения успешно сохранены",
    }),
    target: [showNoticeFx, modalClosed],
});

// Cancel update request when modal window was closed
sample({
    clock: planGate.close,
    source: updatePlanFx,
}).watch(({ controller }) => {
    controller.abort();
});

// show notice and close modal window when plan was successfully deleted
sample({
    clock: removePlanFx.doneData,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно удалена" }),
    target: [showNoticeFx, modalClosed],
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(planGate.close, modalClosed, modalOpened);
});

$error
    .on([updatePlanFx.failData, removePlanFx.failData], (_, error) =>
        error.isCanceled ? null : error.message,
    )
    .reset(
        errorReset,
        updatePlanFx,
        removePlanFx,
        modalClosed,
        MaterialsOpened,
    );

$isDisabled.on(removePlanFx.pending, (_, pending) => pending);

$isModalActive
    .on([modalOpened, backButtonClicked], () => true)
    .on([modalClosed, MaterialsOpened], () => false);

$editingPlan.reset(modalClosed);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, modalClosed, removePlanFx], () => false);
