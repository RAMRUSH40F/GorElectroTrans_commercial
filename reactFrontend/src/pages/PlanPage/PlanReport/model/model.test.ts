import { Scope, allSettled, fork } from "effector";
import {
    $isModalActive,
    modalClosed,
    modalOpened,
    getPeriodsFx,
    $periods,
    $periodsError,
} from "./model";
import { IReportPeriod } from "../PlanReportForm/model/model";

const mockedPeriod: IReportPeriod = { quoter: 1, year: 2023 };
const mockedParams = {
    controller: new AbortController(),
    data: null,
    depId: "1",
};
const mockedMessage = "Something went wrong";
let scope: Scope;

const modalOpenedFn = jest.fn();
modalOpened.watch(modalOpenedFn);

const modalClosedFn = jest.fn();
modalClosed.watch(modalClosedFn);

const getPeriodsFn = jest.fn();
getPeriodsFx.watch(getPeriodsFn);

beforeEach(() => {
    scope = fork();

    modalOpenedFn.mockClear();
    modalClosedFn.mockClear();
    getPeriodsFn.mockClear();
});

test("should set modal active status to true when modalOpened triggers", async () => {
    await allSettled(modalOpened, { scope });

    expect(modalOpenedFn).toBeCalledTimes(1);
    expect(scope.getState($isModalActive)).toEqual(true);
});

test("should set modal active status to false when modalClosed triggers", async () => {
    const scope = fork({ values: new Map().set($isModalActive, true) });
    await allSettled(modalClosed, { scope });

    expect(modalClosedFn).toBeCalledTimes(1);
    expect(scope.getState($isModalActive)).toEqual(false);
});

test("should request periods when modal opens", async () => {
    const scope = fork({
        handlers: new Map().set(getPeriodsFx, () => {
            getPeriodsFn();
            return [mockedPeriod];
        }),
    });

    await allSettled(getPeriodsFx, { scope, params: mockedParams });

    expect(getPeriodsFn).toBeCalledTimes(2);
    expect(getPeriodsFn).toBeCalledWith(mockedParams);
    expect(scope.getState($periods)).toEqual([mockedPeriod]);
});

test("should set periodsError when getPeriodsFx fails", async () => {
    const scope = fork({
        handlers: new Map().set(getPeriodsFx, () => {
            getPeriodsFn();
            const error = {
                isCanceled: false,
                message: mockedMessage,
            };
            throw error;
        }),
    });

    await allSettled(getPeriodsFx, { scope, params: mockedParams });

    expect(getPeriodsFn).toBeCalledTimes(2);
    expect(getPeriodsFn).toBeCalledWith(mockedParams);
    expect(scope.getState($periodsError)).toEqual(mockedMessage);
});

test("should NOT set periodsError when getPeriodsFx was canceled", async () => {
    const scope = fork({
        handlers: new Map().set(getPeriodsFx, () => {
            getPeriodsFn();
            const error = { isCanceled: true, message: mockedMessage };
            throw error;
        }),
    });

    await allSettled(getPeriodsFx, { scope, params: mockedParams });

    expect(getPeriodsFn).toBeCalledTimes(2);
    expect(getPeriodsFn).toBeCalledWith(mockedParams);
    expect(scope.getState($periodsError)).toBeNull();
});
