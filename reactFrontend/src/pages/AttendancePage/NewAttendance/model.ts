import { createEvent, createStore, sample } from "effector";
import { NOTICE, showNoticeFx } from "helpers/notice";
import { addAttendanceFx } from "../model";

export const errorReset = createEvent();
export const modalOpened = createEvent();
export const modalClosed = createEvent();

export const $error = createStore<string | null>(null);
export const $isModalActive = createStore(false);

sample({
    clock: addAttendanceFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно добавлена" }),
    target: showNoticeFx,
});

$error
    .on(addAttendanceFx.failData, (_, error) => error.message)
    .reset(errorReset, addAttendanceFx, modalClosed);

$isModalActive
    .on(modalOpened, () => true)
    .on([modalClosed, addAttendanceFx.done], () => false);
