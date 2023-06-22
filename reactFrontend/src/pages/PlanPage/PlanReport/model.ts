import { attach, createDomain, sample } from "effector";
import { $depId, planGate } from "../model";
import reportApi from "shared/api/reportApi";
import { IReportPeriod } from "./PlanReportForm/model";

const domain = createDomain();

export const errorReset = domain.createEvent();
export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const $periods = domain.createStore<IReportPeriod[]>([]);
export const $isLoading = domain.createStore<boolean>(true);
export const $periodsError = domain.createStore<string | null>(null);
export const $isModalActive = domain.createStore<boolean>(false);

const getPeriodsFx = attach({ effect: reportApi.fetchPeriodsFx });

// Fetch periods when modal window opens
sample({
    clock: modalOpened,
    source: $depId,
    fn: (depId) => ({ depId, controller: new AbortController(), data: null }),
    target: getPeriodsFx,
});

// Cancel fetch quarters request when modal window closes
sample({
    clock: modalClosed,
    source: getPeriodsFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, planGate.close);
});

$isLoading.on(getPeriodsFx.pending, (_, pending) => pending);

$periods.on(getPeriodsFx.doneData, (_, data) => data);

$periodsError.on(getPeriodsFx.failData, (_, { isCanceled, message }) =>
    isCanceled ? null : message
);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);
