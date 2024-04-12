import {
    screen,
    render,
    act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import RouterWrapper from "tests/RouterWrapper";
import TestWrapper from "tests/TestWrapper";
import { Scope, fork, hydrate } from "effector";
import { $error, loginDomain } from "./model";
import LoginPage from ".";

const selectors = {
    username: () => screen.getByPlaceholderText(/логин/i),
    password: () => screen.getByPlaceholderText(/Пароль/i),
    invalidError: () => screen.queryByText(/Неверный логин или пароль/i),
    techError: () => screen.queryByText(/Произошла техническая ошибка/i),
    form: () => screen.getByRole("form", { name: /login form/i }),
    button: () => screen.getByRole("button", { name: /войти/i }),
};

let scope: Scope;
let user: UserEvent;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <TestWrapper scope={scope}>{children}</TestWrapper>;
};

beforeEach(() => {
    scope = fork(loginDomain);
    user = userEvent.setup();
});

test("should display default states on render", () => {
    render(<LoginPage />, { wrapper: RouterWrapper });

    const invalidError = selectors.invalidError();
    const techError = selectors.techError();
    const username = selectors.username();
    const password = selectors.password();
    const button = selectors.button();

    expect(button).not.toBeDisabled();
    expect(invalidError).toBeNull();
    expect(techError).toBeNull();

    expect(username).toHaveValue("");
    expect(password).toHaveValue("");
});

test("should display fields with value when user types", async () => {
    const mockedUsername = "user@mail.com";
    const mockedPassword = "qwerty123";

    render(<LoginPage />, { wrapper: RouterWrapper });

    const username = selectors.username();
    const password = selectors.password();

    await act(async () => {
        await user.type(username, mockedUsername);
        await user.type(password, mockedPassword);
    });

    expect(username).toHaveValue(mockedUsername);
    expect(password).toHaveValue(mockedPassword);
});

test("should display error alert when error is not empty", () => {
    hydrate(scope, {
        values: new Map().set($error, "Неверный логин или пароль"),
    });

    render(<LoginPage />, { wrapper: Wrapper });

    const errorAlert = screen.getByText("Неверный логин или пароль");

    expect(errorAlert).toBeInTheDocument();
});

describe("form validation", () => {
    const requiredError = "Обязательное поле";

    test("should display required errors when fields are empty and form submits", async () => {
        render(<LoginPage />, { wrapper: RouterWrapper });

        const button = selectors.button();

        await act(async () => await user.click(button));

        expect(screen.getAllByText(requiredError)).toHaveLength(2);
    });

    test("should display required error when username field is empty", async () => {
        render(<LoginPage />, { wrapper: RouterWrapper });

        const username = selectors.username();

        await act(async () => {
            await user.click(username);
            await user.tab();
        });

        expect(screen.getByText(requiredError)).toBeInTheDocument();
    });

    test("should display required error when password field is empty", async () => {
        render(<LoginPage />, { wrapper: RouterWrapper });

        const password = selectors.password();

        await act(async () => {
            await user.click(password);
            await user.tab();
        });

        expect(screen.getByText(requiredError)).toBeInTheDocument();
    });

    test("should display required error when password has length less than 5", async () => {
        render(<LoginPage />, { wrapper: RouterWrapper });

        const password = selectors.password();

        await act(async () => {
            await user.type(password, "1234");
            await user.tab();
        });

        expect(screen.getByText(/Минимальная длина: 5/i)).toBeInTheDocument();
    });
});
