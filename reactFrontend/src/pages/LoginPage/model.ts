import { createDomain } from "effector";

import { loginFx } from "shared/auth";

export const loginDomain = createDomain();

export const errorReset = loginDomain.createEvent();

export const $error = loginDomain.createStore<string | null>(null);

$error
    .on(loginFx.failData, (_, error) => error.message)
    .reset(loginFx, errorReset);
