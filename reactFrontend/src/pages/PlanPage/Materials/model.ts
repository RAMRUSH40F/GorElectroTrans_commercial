import { ChangeEvent } from "react";

import { attach, createDomain, sample } from "effector";

import { downloadFileFx } from "helpers/downloadFile";
import { NOTICE, showNoticeFx } from "helpers/notice";

import { IMaterial } from "models/Plan";

import materialApi from "shared/api/materialsApi";
import { AbortParams } from "shared/api/types";

import { $depId, planFileAdded, planFileRemoved } from "../model";

const domain = createDomain();

const checkIsExistingFx = domain.createEffect<
    { file: File; fileNames: string[] },
    File,
    Error
>(({ file, fileNames }) => {
    if (fileNames.includes(file.name)) {
        throw new Error("Файл с таким именем уже существует");
    }
    return file;
});

// #region Events
export const errorReset = domain.createEvent();

export const fileChanged = domain.createEvent<ChangeEvent<HTMLInputElement>>();
const validateFile = domain.createEvent<File>();

export const modalOpened = domain.createEvent<{
    fileNames: string[];
    lessonId: number;
}>();
export const modalClosed = domain.createEvent();

export const confirmingOpened = domain.createEvent<{ fileName: string }>();
export const confirmingClosed = domain.createEvent();

const disabled = domain.createEvent();
const enabled = domain.createEvent();

export const isAddingOpened = domain.createEvent();
const isAddingClosed = domain.createEvent();

const addLoader = domain.createEvent<string>();
const removeLoader = domain.createEvent<string>();

export const backButtonClicked = domain.createEvent();
export const submitButtonClicked = domain.createEvent();
export const confirmButtonClicked = domain.createEvent();
export const downloadButtonClicked = domain.createEvent<string>();
// #endregion

// #region Stores
export const $fileNames = domain.createStore<string[]>([]);
const $lessonId = domain.createStore<number>(-1);
export const $file = domain.createStore<File | null>(null);
const $fileToDelete = domain.createStore<string | null>(null);

export const $error = domain.createStore<string | null>(null);
export const $fileLoaders = domain.createStore<string[]>([]);
export const $isDisabled = domain.createStore<boolean>(false);

export const $isAdding = domain.createStore<boolean>(false);
export const $isConfirming = domain.createStore<boolean>(false);
export const $isModalActive = domain.createStore<boolean>(false);
// #endregion

export const addFileFx = attach({
    effect: materialApi.postFx,
    source: { depId: $depId, lessonId: $lessonId },
    mapParams(
        { data, controller }: AbortParams<FormData>,
        { depId, lessonId },
    ) {
        return { depId, data, controller, lessonId };
    },
});

export const removeFileFx = attach({
    effect: materialApi.deleteFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<IMaterial>, depId) {
        return { depId, data, controller };
    },
});

const fetchFileFx = attach({
    effect: materialApi.fetchFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<string>, depId) {
        return { depId, controller, data };
    },
});

// When submit button is clicked, check if file was selected
sample({
    clock: submitButtonClicked,
    source: $file,
    filter: (file: File | null): file is File => file !== null,
    fn: (file) => file,
    target: validateFile,
});

// If file was not selected, hide input
sample({
    clock: submitButtonClicked,
    source: $file,
    filter: (file) => file === null,
    target: isAddingClosed,
});

// if file was selected, check if file with such name is already existing
sample({
    clock: validateFile,
    source: $fileNames,
    fn: (fileNames, file) => ({ fileNames, file }),
    target: checkIsExistingFx,
});

// If file is not already existing, send request
sample({
    clock: checkIsExistingFx.doneData,
    fn: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { data: formData, controller: new AbortController() };
    },
    target: addFileFx,
});

// If file was successfully added, put file into $plans store
sample({
    clock: addFileFx.doneData,
    target: planFileAdded,
});

// If file was successfully added, show notice
sample({
    clock: addFileFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Материалы успешно добавлены",
    }),
    target: showNoticeFx,
});

// Disable file controls when confirm button was cliked
sample({
    clock: confirmButtonClicked,
    source: $fileToDelete,
    filter: (fileName: string | null): fileName is string => fileName !== null,
    target: addLoader,
});

// Send delete request when confirm button was clicked
sample({
    clock: confirmButtonClicked,
    source: { fileName: $fileToDelete, lessonId: $lessonId },
    filter: (source: {
        fileName: string | null;
        lessonId: number;
    }): source is IMaterial => source.fileName !== null,
    fn: ({ fileName, lessonId }) => ({
        data: { fileName: fileName, lessonId },
        controller: new AbortController(),
    }),
    target: removeFileFx,
});

sample({
    clock: removeFileFx.doneData,
    fn: (data) => data.fileName,
    target: removeLoader,
});

// If file was successfully deleted, remove file from $plans store
sample({
    clock: removeFileFx.doneData,
    target: planFileRemoved,
});

// If file was successfully deleted, show notice
sample({
    clock: removeFileFx.done,
    fn: (_) => ({ type: NOTICE.SUCCESS, message: "Файл успешно удален" }),
    target: showNoticeFx,
});

// Remove loader when delete file request fails
sample({
    clock: removeFileFx.fail,
    fn: ({ params }) => params.data.fileName,
    target: removeLoader,
});

// When donwload file was clicked, make request to fetch file
sample({
    clock: downloadButtonClicked,
    fn: (fileName) => ({ data: fileName, controller: new AbortController() }),
    target: fetchFileFx,
});

// If file was successfully fetched, download file
sample({
    clock: fetchFileFx.doneData,
    target: downloadFileFx,
});

// Remove loader when fetch file request fails
sample({
    clock: fetchFileFx.fail,
    fn: ({ params }) => params.data,
    target: removeLoader,
});

// Reset all stores
domain.onCreateStore(($store) => {
    $store.reset(backButtonClicked, modalClosed);
});

$fileNames
    .on(modalOpened, (_, { fileNames }) => fileNames)
    .on(addFileFx.doneData, (fileNames, data) => [data.fileName, ...fileNames])
    .on(removeFileFx.doneData, (fileNames, { fileName }) =>
        fileNames.filter((currFileName) => currFileName !== fileName),
    );

$lessonId.on(modalOpened, (_, { lessonId }) => lessonId);

$fileLoaders
    .on([downloadButtonClicked, addLoader], (loaders, fileName) => [
        ...loaders,
        fileName,
    ])
    .on([downloadFileFx.doneData, removeLoader], (loaders, fileName) =>
        loaders.filter((name) => name !== fileName),
    );

$file
    .on(fileChanged, (_, event) => {
        const filesList = event.target.files;
        const file = filesList ? filesList[0] : null;
        return file;
    })
    .reset(addFileFx.done);

$fileToDelete.on(confirmingOpened, (_, { fileName }) => fileName);

$isAdding
    .on(isAddingOpened, () => true)
    .on([isAddingClosed, addFileFx.done], () => false);

$error
    .on(checkIsExistingFx.failData, (_, error) => error.message)
    .on(
        [addFileFx.failData, fetchFileFx.failData, removeFileFx.failData],
        (_, { message, isCanceled }) => (isCanceled ? null : message),
    )
    .reset([
        errorReset,
        fileChanged,
        confirmingOpened,
        confirmButtonClicked,
        checkIsExistingFx.done,
        downloadButtonClicked,
    ]);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);

$isConfirming
    .on(confirmingOpened, () => true)
    .on([confirmingClosed, confirmButtonClicked], () => false);

$isDisabled
    .on([disabled, checkIsExistingFx.done], () => true)
    .on([enabled, addFileFx.finally], () => false);
