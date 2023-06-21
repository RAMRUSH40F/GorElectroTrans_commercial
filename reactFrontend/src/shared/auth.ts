import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample,
} from "effector";
import { createGate } from "effector-react";
import { authRequestFx } from "./api";
import { NOTICE, showNoticeFx } from "helpers/notice";
import userApi from "./api/userApi";

export enum ROLES {
    SPEC_1 = "1",
    SPEC_2 = "2",
    SPEC_3 = "3",
    SPEC_4 = "4",
    SPEC_5 = "5",
    SPEC_6 = "6",
    SPEC_7 = "7",
    SPEC_8 = "8",
    SPEC_10 = "10",
    SPEC_11 = "11",
    SPEC_12 = "12",
    SPEC_13 = "13",
    SPEC_14 = "14",
    SPEC_15 = "15",
    ADMIN = "100",
}

export const AuthGate = createGate();

export const loginFx = attach({ effect: userApi.loginFx });
export const logoutFx = attach({ effect: userApi.logoutFx });
export const refreshFx = attach({ effect: userApi.refreshFx });

export const checkAccessTokenFx = createEffect<void, boolean>(() => {
    return localStorage.getItem("accessToken") ? true : false;
});
export const removeTokenFromLocalStorageFx = createEffect(() => {
    localStorage.removeItem("accessToken");
});

export const loggedOut = createEvent();
export const errorSet = createEvent<string>();

export const $roles = createStore<ROLES[]>([]);
export const $isAuth = createStore<boolean>(false);
export const $isLoading = createStore<boolean>(true);
export const $error = createStore<string | null>(null);

// Checking if there is an access token in local storage
sample({
    clock: AuthGate.open,
    target: checkAccessTokenFx,
});

// If access token is in local storage, refresh user's authentication status
sample({
    clock: checkAccessTokenFx.doneData,
    target: refreshFx,
    filter: (hasToken) => hasToken,
});

// Logout if authRequestFx fails with 401 status
sample({
    clock: authRequestFx.failData,
    filter: (error) => error?.response?.status === 401,
    target: loggedOut,
});

// Set error if refreshing authentication status fails
sample({
    clock: refreshFx.failData,
    filter: (error) => error.status !== 401,
    fn: (error) => error.message,
    target: errorSet,
});

// Remove token from local storage when user logged out
sample({
    clock: [logoutFx.doneData, loggedOut],
    target: removeTokenFromLocalStorageFx,
});

// Show notice when logout request was failed
sample({
    clock: logoutFx.fail,
    fn: () => ({ type: NOTICE.ERROR, message: "Произошла техническая ошибка" }),
    target: showNoticeFx,
});

$isLoading
    .on(refreshFx.pending, (_, pending) => pending)
    .on(checkAccessTokenFx.finally, () => false);

$error.on(errorSet, (_, message) => message).reset(refreshFx);

$isAuth
    .on([refreshFx.doneData, loginFx.doneData], () => true)
    .reset(logoutFx.done, loggedOut);

$roles
    .on([loginFx.doneData, refreshFx.doneData], (_, roles) => roles)
    .reset(logoutFx.done, loggedOut);
