import { createEffect } from "effector";
import decodeJwt from "jwt-decode";
import { ROLES } from "constants/roles";
import { authRequestFx } from "..";
import { AuthError } from "../types";

export interface ICredentials {
    username: string;
    password: string;
}

interface UserApiError {
    message: string;
    status: number;
}

export const refreshFx = createEffect<void, ROLES[], UserApiError>(
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
