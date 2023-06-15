import { createEffect } from "effector";
import { AuthError, authRequestFx, requestFx } from ".";
import decodeJwt from "jwt-decode";
import { ROLES } from "../../constants/roles";
import { showNotion } from "../../helpers/showNotion";
import { NOTION } from "../../constants/notion";

export interface ICredentials {
    username: string;
    password: string;
}

interface UserApiError {
    message: string;
    status: number;
}

export const loginUserFx = createEffect<ICredentials, ROLES[], UserApiError>(
    async (credentials) => {
        try {
            const response = await requestFx({
                method: "POST",
                url: "/auth/login",
                data: credentials,
            });
            const token = response.headers.authorization;
            const { role } = decodeJwt(token) as { role: ROLES[] };
            localStorage.setItem("accessToken", token);
            return role;
        } catch (error) {
            const err = error as any;
            const message = err?.response
                ? "Неверный логин или пароль"
                : "Произошла техническая ошибка";
            const status =
                err?.response?.data?.status ?? err?.response?.status ?? 400;
            const customError: UserApiError = { message, status };
            throw customError;
        }
    }
);

export const logoutUserFx = createEffect<void, void, void>(async () => {
    try {
        await authRequestFx({
            method: "POST",
            url: "/auth/logout",
        });
    } catch (error) {
        showNotion(NOTION.ERROR, "Произошла техническая ошибка");
    }
});

export const refreshUserFx = createEffect<void, ROLES[], UserApiError>(
    async () => {
        try {
            const response = await authRequestFx({
                method: "POST",
                url: "/auth/validate",
            });
            const token = response.headers.authorization;
            const { role } = decodeJwt(token) as { role: ROLES[] };
            return role;
        } catch (error) {
            const err = error as AuthError;
            const message =
                err?.response?.data?.message ??
                "Произошла техническая ошибка. Попробуйте перезагрузить страницу.";
            const status =
                err.response?.data.status ?? err?.response?.status ?? 400;
            const customError: UserApiError = { message, status };
            throw customError;
        }
    }
);
