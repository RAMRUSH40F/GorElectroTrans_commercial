import { createDomain, sample } from "effector";
import { IAttendance } from "models/Attendance";
import { NOTICE, showNoticeFx } from "helpers/notice";
import {
    attendanceGate,
    removeAttendanceFx,
    updateAttendanceFx,
} from "../model";

const domain = createDomain();

export const errorReset = domain.createEvent();

export const modalOpened = domain.createEvent<IAttendance>();
export const modalClosed = domain.createEvent();

export const confirmingClosed = domain.createEvent();
export const confirmingOpened = domain.createEvent();
export const movedToConfirm = domain.createEvent();
export const confirmButtonClicked = domain.createEvent();

export const $error = domain.createStore<string | null>(null);
export const $isDisabled = domain.createStore<boolean>(false);

export const $isModalActive = domain.createStore<boolean>(false);
export const $editingAttendance = domain.createStore<IAttendance | null>(null);

export const $isConfirming = domain.createStore<boolean>(false);

// Set an attendance for editing
sample({
    clock: modalOpened,
    target: $editingAttendance,
});

// Move to confirm modal window when delete button was clicked
sample({
    clock: movedToConfirm,
    target: [errorReset, confirmingOpened],
});

// Delete attendance when confirm button was clicked
sample({
    clock: confirmButtonClicked,
    source: $editingAttendance,
    filter: (attendance: IAttendance | null): attendance is IAttendance =>
        attendance !== null,
    fn: (attendance) => ({
        data: {
            lessonId: attendance.lessonId,
            studentId: attendance.studentId,
        },
        controller: new AbortController(),
    }),
    target: removeAttendanceFx,
});

// Cancel delete request when modal was closed
sample({
    clock: attendanceGate.close,
    source: removeAttendanceFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Show notice and close modal window when attendance was successfully updated
sample({
    clock: updateAttendanceFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Изменения успешно сохранены",
    }),
    target: [showNoticeFx, modalClosed],
});

// Cancel update request when modal was closed
sample({
    clock: attendanceGate.close,
    source: updateAttendanceFx,
}).watch(({ controller }) => {
    controller.abort();
});

// show notice and close modal window when attendance was successfully deleted
sample({
    clock: removeAttendanceFx.doneData,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Запись успешно удалена" }),
    target: [showNoticeFx, modalClosed],
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(attendanceGate.close, modalClosed, modalOpened);
});

$error
    .on(
        [updateAttendanceFx.failData, removeAttendanceFx.failData],
        (_, error) => (error.isCanceled ? null : error.message)
    )
    .reset(errorReset, updateAttendanceFx, removeAttendanceFx);

$isDisabled.on(removeAttendanceFx.pending, (_, pending) => pending);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);

$editingAttendance.reset(modalClosed);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, modalClosed, removeAttendanceFx], () => false);
