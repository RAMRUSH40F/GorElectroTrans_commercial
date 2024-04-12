import { Scope, allSettled, fork } from "effector";
import {
    $depError,
    $departments,
    $error,
    $isModalActive,
    errorReset,
    getDepartmentsFx,
    modalClosed,
    modalOpened,
} from "./model";
import { IDepartment } from "models/Department";
import { addEmployeeFx } from "pages/EmployeesPage/model";
import { IEmployee } from "models/Employee";

const mockedMessage = "Something went wrong";
const mockedDepartment: IDepartment = { id: 1, name: "test_name" };
const mockedDepParams = {
    controller: new AbortController(),
    depId: "1",
    data: null,
};
const mockedEmployee: IEmployee = {
    fullName: "test_name",
    studentId: "test_id",
    subdepartmentName: "test_sub_name",
};
const mockedEmployeeParams = {
    controller: new AbortController(),
    data: mockedEmployee,
};

const modalOpenedFn = jest.fn();
modalOpened.watch(modalOpenedFn);

const modalClosedFn = jest.fn();
modalClosed.watch(modalClosedFn);

const errorResetFn = jest.fn();
errorReset.watch(errorResetFn);

const getDepartmentsFn = jest.fn();
getDepartmentsFx.watch(getDepartmentsFn);

const addEmployeeFn = jest.fn();
addEmployeeFx.watch(addEmployeeFn);

beforeEach(() => {
    modalOpenedFn.mockClear();
    modalClosedFn.mockClear();
    errorResetFn.mockClear();
    getDepartmentsFn.mockClear();
    addEmployeeFn.mockClear();
});

test("should set modal active status when modalOpened triggers", async () => {
  const getDepartmentsFxFn = jest.fn();

    const scope = fork({ handlers: new Map().set(getDepartmentsFx, getDepartmentsFxFn) });

    await allSettled(modalOpened, { scope });

    expect(modalOpenedFn).toBeCalledTimes(1);
    expect(scope.getState($isModalActive)).toEqual(true);
});

test("should set modal unactive status when modalClosed triggers", async () => {
    const scope = fork({ values: new Map().set($isModalActive, true) });
    await allSettled(modalClosed, { scope });

    expect(modalClosedFn).toBeCalledTimes(1);
    expect(scope.getState($isModalActive)).toEqual(false);
});

test("should reset error when errorReset triggers", async () => {
    const scope = fork({ values: new Map().set($error, mockedMessage) });

    await allSettled(errorReset, { scope });

    expect(errorResetFn).toBeCalledTimes(1);
    expect(scope.getState($error)).toBeNull();
});

test("should request departments when modal openes", async () => {
    const scope = fork({
        handlers: new Map().set(getDepartmentsFx, () => {
            getDepartmentsFn();
            return [mockedDepartment];
        }),
    });

    await allSettled(getDepartmentsFx, { scope, params: mockedDepParams });

    expect(getDepartmentsFn).toBeCalledTimes(2);
    expect(getDepartmentsFn).toBeCalledWith(mockedDepParams);
    expect(scope.getState($departments)).toEqual([mockedDepartment]);
});

test("should set depError when getDepartmentsFx fails", async () => {
    const scope = fork({
        handlers: new Map().set(getDepartmentsFx, () => {
            getDepartmentsFn();
            const error = {
                isCanceled: false,
                message: mockedMessage,
            };
            throw error;
        }),
    });

    await allSettled(getDepartmentsFx, { scope, params: mockedDepParams });

    expect(getDepartmentsFn).toBeCalledTimes(2);
    expect(getDepartmentsFn).toBeCalledWith(mockedDepParams);
    expect(scope.getState($depError)).toEqual(mockedMessage);
});

test("should not set depError when getDepartmentsFx was canceled", async () => {
    const scope = fork({
        handlers: new Map().set(getDepartmentsFx, () => {
            getDepartmentsFn();
            const error = { isCanceled: true, message: mockedMessage };
            throw error;
        }),
    });

    await allSettled(getDepartmentsFx, { scope, params: mockedDepParams });

    expect(getDepartmentsFn).toBeCalledTimes(2);
    expect(getDepartmentsFn).toBeCalledWith(mockedDepParams);
    expect(scope.getState($depError)).toBeNull();
});

test("should set error when addEmployeeFx fails", async () => {
    const scope = fork({
        handlers: new Map().set(addEmployeeFx, () => {
            addEmployeeFn();
            const error = { isCanceled: false, message: mockedMessage };
            throw error;
        }),
    });

    await allSettled(addEmployeeFx, { scope, params: mockedEmployeeParams });

    expect(addEmployeeFn).toBeCalledTimes(2);
    expect(addEmployeeFn).toBeCalledWith(mockedEmployeeParams);
    expect(scope.getState($depError)).toBeNull();
});

test("should not set error when addEmployeeFx was canceled", async () => {
    const scope = fork({
        handlers: new Map().set(addEmployeeFx, () => {
            addEmployeeFn();
            const error = { isCanceled: true, message: mockedMessage };
            throw error;
        }),
    });

    await allSettled(addEmployeeFx, { scope, params: mockedEmployeeParams });

    expect(addEmployeeFn).toBeCalledTimes(2);
    expect(addEmployeeFn).toBeCalledWith(mockedEmployeeParams);
    expect(scope.getState($depError)).toBeNull();
});
