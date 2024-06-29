import { ChangeEvent } from "react";

import { attach, createDomain, sample } from "effector";

import { downloadFileFx } from "helpers/downloadFile";
import { NOTICE, showNoticeFx } from "helpers/notice";

import employeeApi from "shared/api/employeesApi";

import { $depId } from "../model";
import { uploadEmployeesFx } from "../model/model";

const domain = createDomain();

export const errorReset = domain.createEvent();

export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const fileChanged = domain.createEvent<ChangeEvent<HTMLInputElement>>();

export const backButtonClicked = domain.createEvent();
export const downloadButtonClicked = domain.createEvent();
export const uploadButtonClicked = domain.createEvent();

export const $file = domain.createStore<File | null>(null);

export const $isUploading = domain.createStore(false);
export const $isTemplateLoading = domain.createStore(false);

export const $error = domain.createStore<string | null>(null);

export const $isModalActive = domain.createStore<boolean>(false);

export const getTemplateFx = attach({ effect: employeeApi.fetchTemplateFx });

sample({
    clock: downloadButtonClicked,
    source: { depId: $depId },
    fn: ({ depId }) => {
        return {
            depId,
            data: null,
            controller: new AbortController(),
        };
    },
    target: getTemplateFx,
});

sample({
    clock: getTemplateFx.doneData,
    fn: (file) => ({
        file,
        fileName: `Шаблон_сотрудников.xlsx`,
        container:
            (document.querySelector(
                "#employees-uploading-modal",
            ) as HTMLElement) ?? document.body,
    }),
    target: downloadFileFx,
});

sample({
    clock: uploadButtonClicked,
    source: { file: $file },
    filter: ({ file }) => file !== null,
    fn: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file!);
        return { data: formData, controller: new AbortController() };
    },
    target: uploadEmployeesFx,
});

sample({
    clock: uploadEmployeesFx.done,
    fn: (_) => ({
        type: NOTICE.SUCCESS,
        message: "Работники успешно загружены",
    }),
    target: showNoticeFx,
});

domain.onCreateStore(($store) => {
    $store.reset(backButtonClicked, modalClosed);
});

$file
    .on(fileChanged, (_, event) => {
        const filesList = event.target.files;
        const file = filesList ? filesList[0] : null;
        return file;
    })
    .reset(uploadEmployeesFx.done);

$isUploading.on(uploadEmployeesFx.pending, (_, pending) => pending);
$isTemplateLoading.on(getTemplateFx.pending, (_, pending) => pending);

$error
    .on([uploadEmployeesFx.failData, getTemplateFx.failData], (_, error) =>
        error.isCanceled ? null : error.message,
    )
    .reset(errorReset, uploadEmployeesFx, getTemplateFx, modalClosed);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);
