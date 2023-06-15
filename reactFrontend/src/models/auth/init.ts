import { sample } from "effector";
import {
    $error,
    $isAuth,
    $isLoading,
    $roles,
    AuthGate,
    checkAccessTokenFx,
    errorSet,
    loggedOut,
    loginFx,
    logoutFx,
    refreshFx,
    removeTokenFromLocalStorageFx,
} from ".";
import { authRequestFx } from "../../api";

checkAccessTokenFx.use(() => {
    return localStorage.getItem("accessToken") ? true : false;
});

removeTokenFromLocalStorageFx.use(() => {
    localStorage.removeItem("accessToken");
});

// Checking if there is an access token in local storage
sample({
    clock: AuthGate.open,
    target: checkAccessTokenFx,
});

// If access token is in local storage, refresh user's authentication status
sample({
    clock: checkAccessTokenFx.doneData,
    target: refreshFx,
    filter: (hasToken) => hasToken,
});

// Logout if authRequestFx fails with 401 status
sample({
    clock: authRequestFx.failData,
    filter: (error) => error?.response?.status === 401,
    target: loggedOut,
});

// Set error if refreshing authentication status fails
sample({
    clock: refreshFx.failData,
    filter: (error) => error.status !== 401,
    fn: (error) => error.message,
    target: errorSet,
});

// Remove token from local storage when user logged out
sample({
    clock: [logoutFx.doneData, loggedOut],
    target: removeTokenFromLocalStorageFx,
});

$isLoading.on(refreshFx.pending, (_, pending) => pending);
$isLoading.on(checkAccessTokenFx.finally, () => false);
$error.on(errorSet, (_, message) => message);
$error.reset(refreshFx);

$isAuth.on([refreshFx.doneData, loginFx.doneData], () => true);
$isAuth.reset(logoutFx.done, loggedOut);

$roles.on([loginFx.doneData, refreshFx.doneData], (_, roles) => roles);
$roles.reset(logoutFx.done, loggedOut);
