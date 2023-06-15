import { attach, createEffect, createEvent, createStore } from "effector";
import { ROLES } from "../../constants/roles";
import { createGate } from "effector-react";
import { loginUserFx, logoutUserFx, refreshUserFx } from "../../api/userApi";

export const AuthGate = createGate();

export const loginFx = attach({ effect: loginUserFx });
export const logoutFx = attach({ effect: logoutUserFx });
export const refreshFx = attach({ effect: refreshUserFx });

export const checkAccessTokenFx = createEffect<void, boolean>();
export const removeTokenFromLocalStorageFx = createEffect();

export const loggedOut = createEvent();
export const errorSet = createEvent<string>();

export const $roles = createStore<ROLES[]>([]);
export const $isAuth = createStore<boolean>(false);
export const $isLoading = createStore<boolean>(true);
export const $error = createStore<string | null>(null);
