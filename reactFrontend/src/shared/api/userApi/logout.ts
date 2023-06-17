import { createEffect } from "effector";
import { authRequestFx } from "..";

export const logoutFx = createEffect<void, void, void>(() => {
    authRequestFx({
        method: "POST",
        url: "/auth/logout",
    });
});
