import { screen, render, findByRole, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import LoginPage from ".";
import RenderRouterWrapper from "tests/RenderRouterWrapper";

const selectors = {
    email: () => screen.getByRole("textbox", { name: /username/i }),
    password: () => screen.getByPlaceholderText(/Пароль/i),
    invalidError: () => screen.queryByText(/Неверный логин или пароль/i),
    techError: () => screen.queryByText(/Произошла техническая ошибка/i),
};

let user: UserEvent;
const submitFn = jest.fn();

beforeEach(() => {
    submitFn.mockClear();
    user = userEvent.setup();
});

test("should render on default states", () => {
    render(<LoginPage />, { wrapper: RenderRouterWrapper });

    const invalidError = selectors.invalidError();
    const techError = selectors.techError();
    const email = selectors.email();
    const password = selectors.password();

    expect(invalidError).toBeNull();
    expect(techError).toBeNull();

    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
});

test("should display fields with value when user types", async () => {
    const mockedEmail = "user@mail.com";
    const mockedPassword = "qwerty123";

    render(<LoginPage />, { wrapper: RenderRouterWrapper });

    const email = selectors.email();
    const password = selectors.password();

    await act(async () => {
        await user.type(email, mockedEmail);
        await user.type(password, mockedPassword);
    });

    expect(email).toHaveValue(mockedEmail);
    expect(password).toHaveValue(mockedPassword);
});

test("should submit form when all fields are filled", () => {});
