import { allSettled, fork } from "effector";

import { $isModalActive, modalClosed, modalOpened } from "./model";

const modalOpenedFn = jest.fn();
modalOpened.watch(modalOpenedFn);

const modalClosedFn = jest.fn();
modalClosed.watch(modalClosedFn);

beforeEach(() => {
    modalOpenedFn.mockClear();
    modalClosedFn.mockClear();
});

test("should set modal active status to true when modalOpened triggers", async () => {
    const scope = fork();

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
