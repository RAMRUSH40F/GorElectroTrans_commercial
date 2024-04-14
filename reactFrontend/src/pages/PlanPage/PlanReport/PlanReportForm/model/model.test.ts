import { allSettled, fork } from "effector";

import { DropdownOption } from "components/formElements/Dropdown";

import { downloadFileFx } from "helpers/downloadFile";

import {
    $activeOption,
    $activePeriod,
    $error,
    $isSubmitting,
    activeOptionChanged,
    formSubmitted,
    getReportFx,
} from "./model";

const mockedMessage = "Something went wrong";
const mockedParams = {
    controller: new AbortController(),
    data: null,
    depId: "1",
    quarter: 1,
    year: 2023,
};
const mockedOption: DropdownOption = {
    label: `Год: 2023, квартал: 1`,
    value: `1,2023`,
};

const activeOptionChangedFn = jest.fn();
activeOptionChanged.watch(activeOptionChangedFn);

const formSubmittedFn = jest.fn();
formSubmitted.watch(formSubmittedFn);

const getReportFn = jest.fn();
getReportFx.watch(getReportFn);

const downloadFileFn = jest.fn();
downloadFileFx.watch(downloadFileFn);

const submittingFn = jest.fn();
$isSubmitting.watch(submittingFn);

beforeEach(() => {
    activeOptionChangedFn.mockClear();
    formSubmittedFn.mockClear();
    getReportFn.mockClear();
    downloadFileFn.mockClear();
    submittingFn.mockClear();
});

test("should set active option on activeOptionChanged", async () => {
    const newMockedOption: DropdownOption = {
        label: "test_label",
        value: "test_value",
    };
    const scope = fork({
        values: new Map().set($activeOption, mockedOption),
    });

    expect(scope.getState($activeOption)).toEqual(mockedOption);

    await allSettled(activeOptionChanged, { scope, params: newMockedOption });

    expect(activeOptionChangedFn).toBeCalledTimes(1);
    expect(activeOptionChangedFn).toBeCalledWith(newMockedOption);

    expect(scope.getState($activeOption)).toEqual(newMockedOption);
});

test("should fetch report on formSubmitted", async () => {
    const scope = fork({
        values: new Map().set($activePeriod, mockedOption),
        handlers: new Map().set(getReportFx, () => {
            getReportFn();
            return {
                file: new Blob(),
                period: { quoter: 1, year: 2023 },
            };
        }),
    });

    await allSettled(formSubmitted, { scope });

    expect(formSubmittedFn).toBeCalledTimes(1);
    expect(getReportFn).toBeCalledTimes(2);
});

test("should set submitting state while fetching report", async () => {
    const scope = fork({
        handlers: new Map().set(getReportFx, () => {
            getReportFn();
            return {
                file: new Blob(),
                period: { quoter: 1, year: 2023 },
            };
        }),
    });

    await allSettled(getReportFx, { scope, params: mockedParams });

    expect(getReportFn).toBeCalledTimes(2);
    expect(getReportFn).toBeCalledWith(mockedParams);

    expect(submittingFn).toBeCalledTimes(2);
    expect(submittingFn).toBeCalledWith(true);
    expect(submittingFn).toBeCalledWith(false);
});

test("should set error when request fails", async () => {
    const scope = fork({
        handlers: new Map().set(getReportFx, () => {
            getReportFn();
            const error = { isCanceled: false, message: mockedMessage };
            throw error;
        }),
    });

    await allSettled(getReportFx, { scope, params: mockedParams });

    expect(getReportFn).toBeCalledTimes(2);
    expect(getReportFn).toBeCalledWith(mockedParams);

    expect(scope.getState($error)).toEqual(mockedMessage);
});

test("should trigger downloadFileFx when report was successfully fetched", async () => {
    const scope = fork({
        handlers: new Map()
            .set(getReportFx, () => {
                getReportFn();
                return {
                    file: new Blob(),
                    period: { quoter: 1, year: 2023 },
                };
            })
            .set(downloadFileFx, downloadFileFn),
    });

    await allSettled(getReportFx, { scope, params: mockedParams });

    expect(getReportFn).toBeCalledTimes(2);
    expect(getReportFn).toBeCalledWith(mockedParams);

    expect(downloadFileFn).toBeCalledTimes(2);
    expect(downloadFileFn).toBeCalledWith({
        file: new Blob(),
        fileName: "Отчет_1кв_2023.xls",
    });
});
