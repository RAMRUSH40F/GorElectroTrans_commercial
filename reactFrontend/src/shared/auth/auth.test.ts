import {
    $error,
    $isAuth,
    $isLoading,
    $roles,
    ROLES,
    checkAccessTokenFx,
    loggedIn,
    loggedOut,
    refreshFx,
} from ".";
import { allSettled, fork } from "effector";

import { authRequestFx } from "shared/api";

test("should not invoke refreshFx if there is not access token in LC", async () => {
    const refreshFn = jest.fn();
    const loginFn = jest.fn();
    const unwatch = refreshFx.doneData.watch(loginFn);

    const scope = fork({
        handlers: new Map()
            .set(checkAccessTokenFx, () => false)
            .set(refreshFx, refreshFn),
    });

    await allSettled(checkAccessTokenFx, { scope });

    expect(refreshFn).toBeCalledTimes(0);
    expect(loginFn).toBeCalledTimes(0);

    unwatch();
});

test("should invoke refreshFx if there is access token in LC", async () => {
    const refreshFn = jest.fn();
    const loginFn = jest.fn();
    const unwatch = refreshFx.doneData.watch(loginFn);

    const scope = fork({
        handlers: new Map()
            .set(checkAccessTokenFx, () => 1)
            .set(refreshFx, refreshFn),
    });

    await allSettled(checkAccessTokenFx, { scope });

    expect(refreshFn).toBeCalledTimes(1);
    expect(loginFn).toBeCalledTimes(1);

    unwatch();
});

test("should set auth status and roles after successfull logging", async () => {
    const mockedRoles = [ROLES.SPEC_1, ROLES.SPEC_2];
    const scope = fork();

    await allSettled(loggedIn, { scope, params: mockedRoles });

    expect(scope.getState($roles)).toEqual(mockedRoles);
    expect(scope.getState($isAuth)).toEqual(true);
});

test("should stop loading when refresh is finished", async () => {
    const refreshFn = jest.fn();

    const scope = fork({
        handlers: new Map().set(refreshFx, refreshFn),
    });

    expect(refreshFn).toBeCalledTimes(0);
    expect(scope.getState($isLoading)).toEqual(true);

    await allSettled(refreshFx, { scope });

    expect(refreshFn).toBeCalledTimes(1);
    expect(scope.getState($isLoading)).toEqual(false);
});

test("should set error when refresh fails with status !== 401", async () => {
    const scope = fork({
        handlers: new Map().set(refreshFx, () => {
            const error = {
                status: 500,
                message: "Something went wrong",
            };
            throw error;
        }),
    });

    await allSettled(refreshFx, { scope });

    expect(scope.getState($error)).toEqual("Something went wrong");
});

test("should invoke loggedOut event when authRequestFx fails with status code 401", async () => {
    const loggoutFn = jest.fn();
    const unwatch = authRequestFx.failData.watch(loggoutFn);

    const scope = fork({
        handlers: new Map().set(authRequestFx, () => {
            const error = {
                status: 401,
            };
            throw error;
        }),
    });

    await allSettled(authRequestFx, { scope, params: {} });

    expect(loggoutFn).toBeCalledTimes(1);

    unwatch();
});

test("should reset stores after logout", async () => {
    const mockedRoles = [ROLES.SPEC_1, ROLES.SPEC_10];

    const scope = fork({
        values: new Map().set($roles, mockedRoles).set($isAuth, true),
    });

    expect(scope.getState($roles)).toEqual(mockedRoles);
    expect(scope.getState($isAuth)).toEqual(true);

    await allSettled(loggedOut, { scope });

    expect(scope.getState($roles)).toEqual([]);
    expect(scope.getState($isAuth)).toEqual(false);
});
