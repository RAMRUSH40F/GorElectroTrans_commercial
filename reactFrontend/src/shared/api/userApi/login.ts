import { createEffect } from "effector";
import { requestFx } from "..";
import decodeJwt from "jwt-decode";
import { ROLES } from "shared/auth";

export interface ICredentials {
    username: string;
    password: string;
}

interface UserApiError {
    message: string;
    status: number;
}

export const loginFx = createEffect<ICredentials, ROLES[], UserApiError>(
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
