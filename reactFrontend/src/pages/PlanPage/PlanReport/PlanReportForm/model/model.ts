import { attach, createDomain, sample } from "effector";

import { $depId, planGate } from "pages/PlanPage/model";

import { DropdownOption } from "components/formElements/Dropdown";

import { downloadFileFx } from "helpers/downloadFile";

import reportApi from "shared/api/reportApi";
import { downloadFileFx } from "helpers/downloadFile";

import { $periods, modalClosed, modalOpened } from "../../model/model";

export interface IReportPeriod {
    year: number;
    quoter: number;
}

interface SubmitSource {
    period: IReportPeriod | null;
    depId: string;
}

const domain = createDomain();

export const activeOptionChanged = domain.createEvent<DropdownOption>();
export const formSubmitted = domain.createEvent();

export const $periodsOptions = domain.createStore<DropdownOption[]>([]);
export const $activeOption = domain.createStore<DropdownOption | null>(null);
export const $activePeriod = domain.createStore<IReportPeriod | null>(null);
export const $isSubmitting = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

export const getReportFx = attach({ effect: reportApi.fetchFx });

// Fetch report when form submits
sample({
    clock: formSubmitted,
    source: { period: $activePeriod, depId: $depId },
    filter: (
        source: SubmitSource,
    ): source is { depId: string; period: IReportPeriod } =>
        source.period !== null,
    fn: ({ depId, period }) => ({
        depId,
        year: period.year,
        quarter: period.quoter,
        data: null,
        controller: new AbortController(),
    }),
    target: getReportFx,
});

// When report was successfully fetched, donwload file
sample({
    clock: getReportFx.doneData,
    fn: ({ file, period }) => ({
        file,
        fileName: `Отчет_${period.quoter}кв_${period.year}.xls`,
    }),
    target: downloadFileFx,
});

// Reset all stores when component mountes and unmounts
domain.onCreateStore(($store) => {
    $store.reset(modalOpened, modalClosed, planGate.close);
});

$periodsOptions.on($periods, (_, periods) =>
    periods.map(({ quoter, year }) => ({
        label: `Год: ${year}, квартал: ${quoter}`,
        value: `${quoter},${year}`,
    })),
);

$activeOption.on($periodsOptions, (_, options) => options[0]);

$activePeriod.on($activeOption, (_, option) => {
    if (option === null) return null;
    const [quoter, year] = option.value.split(",");
    return { quoter: parseInt(quoter), year: parseInt(year) };
});

$activeOption.on(activeOptionChanged, (_, option) => option);

$isSubmitting.on(getReportFx.pending, (_, pending) => pending);

$error
    .on(getReportFx.failData, (_, error) => error.message)
    .reset(modalClosed, activeOptionChanged, formSubmitted);
