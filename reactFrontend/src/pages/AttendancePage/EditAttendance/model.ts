import { createEvent, createStore, sample } from "effector";
import { IAttendance } from "models/Attendance";
import { removeAttendanceFx, updateAttendanceFx } from "../model";
import { NOTICE, showNoticeFx } from "helpers/notice";

export const errorReset = createEvent();

export const modalOpened = createEvent<IAttendance>();
export const modalClosed = createEvent();

export const confirmingClosed = createEvent();
export const confirmingOpened = createEvent();
export const movedToConfirm = createEvent();
export const confirmButtonClicked = createEvent();

export const $error = createStore<string | null>(null);
export const $isDisabled = createStore<boolean>(false);

export const $isModalActive = createStore<boolean>(false);
export const $editingAttendance = createStore<IAttendance | null>(null);

export const $isConfirming = createStore<boolean>(false);

// Setting an attendance for editing
sample({
    clock: modalOpened,
    target: $editingAttendance,
});

// Move to confirm modal window when delete button is clicked
sample({
    clock: movedToConfirm,
    target: [errorReset, confirmingOpened],
});

sample({
    clock: confirmButtonClicked,
    source: $editingAttendance,
    filter: (attendance) => attendance !== null,
    fn: (attendance) => ({
        lessonId: attendance?.lessonId || 1,
        studentId: attendance?.studentId || "",
    }),
    target: removeAttendanceFx,
});

// Show notice and close modal window when attendance successfully updated
sample({
    clock: updateAttendanceFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Изменения успешно сохранены",
    }),
    target: [showNoticeFx, modalClosed],
});

// show notice and close modal window when attendance successfully deleted
sample({
    clock: removeAttendanceFx.doneData,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно удалена" }),
    target: [showNoticeFx, modalClosed],
});

$error
    .on(
        [updateAttendanceFx.failData, removeAttendanceFx.failData],
        (_, error) => error.message
    )
    .reset(errorReset, updateAttendanceFx, removeAttendanceFx);

$isDisabled.on(removeAttendanceFx.pending, (_, pending) => pending);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);

$editingAttendance.reset(modalClosed);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, modalClosed, removeAttendanceFx], () => false);
