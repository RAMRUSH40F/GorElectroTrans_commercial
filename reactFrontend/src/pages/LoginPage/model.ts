import { createEvent, createStore } from "effector";
import { loginFx } from "../../models/auth";

export const errorReset = createEvent();

export const $error = createStore<string | null>(null);

$error.on(loginFx.failData, (_, error) => error.message);
$error.reset(loginFx, errorReset);
