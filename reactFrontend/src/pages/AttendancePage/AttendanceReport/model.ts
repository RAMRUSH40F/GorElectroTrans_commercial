import { createDomain } from "effector";

const domain = createDomain();

export const modalOpened = domain.createEvent();
export const modalClosed = domain.createEvent();

export const $isModalActive = domain.createStore<boolean>(false);

export const $error = domain.createStore<string | null>(null);

$isModalActive.on(modalOpened, () => true).on(modalClosed, () => false);
