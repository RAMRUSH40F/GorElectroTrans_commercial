import { attach, createDomain, sample } from "effector";

import { DateRangeFormState } from "components/DateRangeForm/types";

import { downloadFileFx } from "helpers/downloadFile";
import { parseISO } from "helpers/parseISO";

import attendanceApi from "shared/api/attendanceApi";

import { $depId } from "../model";

const domain = createDomain();

// Events
export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const formSubmitted = domain.createEvent<DateRangeFormState>();

// Stores
export const $isModalActive = domain.createStore<boolean>(false);

export const $isLoading = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

// Effects
export const getReportFx = attach({ effect: attendanceApi.fetchReportFx });

// Relations
// Fetch report file when form submits
sample({
    clock: formSubmitted,
    source: { depId: $depId },
    fn: ({ depId }, { endDate, startDate }) => {
        const dateFrom = parseISO(startDate.toISOString()).day;
        const dateTo = parseISO(endDate.toISOString()).day;
        return {
            depId,
            dateFrom,
            dateTo,
            data: null,
            controller: new AbortController(),
        };
    },
    target: getReportFx,
});

// When report was successfully fetched, download file
sample({
    clock: getReportFx.doneData,
    fn: ({ file, dateRange: { dateFrom, dateTo } }) => ({
        file,
        fileName: `Отчет_${dateFrom}_${dateTo}.xlsx`,
    }),
    target: downloadFileFx,
});

// Subscriptions
domain.onCreateStore((store) => {
    store.reset(modalOpened, modalClosed);
});

$isLoading.on(getReportFx.pending, (_, pending) => pending);

$error
    .on(getReportFx.failData, (_, { isCanceled, message }) =>
        isCanceled ? null : message,
    )
    .reset(getReportFx);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);
