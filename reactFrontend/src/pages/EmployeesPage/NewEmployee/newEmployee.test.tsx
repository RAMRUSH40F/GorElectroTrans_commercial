import NewEmployee from ".";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { fork } from "effector";
import TestWrapper from "tests/TestWrapper";

import { IDepartment } from "models/Department";

import {
    $depError,
    $departments,
    $isLoading,
    $isModalActive,
    modalClosed,
    modalOpened,
} from "./model/model";

const selectors = {
    form: () => screen.getByRole("form", { name: /employee form/i }),
    employeeId: () => screen.getByRole("textbox", { name: /табельный номер/i }),
    name: () => screen.getByRole("textbox", { name: /фио/i }),
    departments: () => screen.getByRole("list"),
    submitButton() {
        return within(this.form()).getByRole("button", { name: /добавить/i });
    },
};

const mockedDepartment: IDepartment = { id: 1, name: "test_dep_name" };
const mockedMessage = "Something went wrong";

let user: UserEvent;
const submitFn = jest.fn();

beforeEach(() => {
    user = userEvent.setup();
    submitFn.mockClear();
});

test("should display modal when modal state is active", () => {
    const scope = fork({ values: new Map().set($isModalActive, true) });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const title = screen.getByRole("heading", { name: /добавление/i });

    expect(title).toBeInTheDocument();
});

test("should NOT display modal when modal state is not active", () => {
    const scope = fork({ values: new Map().set($isModalActive, false) });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const title = screen.queryByRole("heading", { name: /добавление/i });

    expect(title).not.toBeInTheDocument();
});

test("should display loader when loading is active", () => {
    const scope = fork({
        values: new Map().set($isModalActive, true).set($isLoading, true),
    });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const loader = screen.getByText(/Загрузка/i);

    expect(loader).toBeInTheDocument();
});

test("should display error when it is not empty", () => {
    const scope = fork({
        values: new Map()
            .set($isModalActive, true)
            .set($depError, mockedMessage),
    });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const error = screen.getByText(mockedMessage);

    expect(error).toBeInTheDocument();
});

test("should display empty alert when departments list is empty", () => {
    const scope = fork({
        values: new Map()
            .set($isModalActive, true)
            .set($isLoading, false)
            .set($departments, []),
    });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const alert = screen.getByText(/Нет существующих отделов/i);
    const form = screen.queryByRole("form");

    expect(alert).toBeInTheDocument();
    expect(form).not.toBeInTheDocument();
});

test("should display form when departments list is not empty", () => {
    const scope = fork({
        values: new Map()
            .set($isModalActive, true)
            .set($isLoading, false)
            .set($departments, [mockedDepartment]),
    });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const alert = screen.queryByText(/Нет существующих отделов/i);
    const form = selectors.form();
    const employeeId = selectors.employeeId();
    const name = selectors.name();
    const departmentName = screen.getAllByText(mockedDepartment.name)[0];

    expect(alert).not.toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(employeeId).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(departmentName).toBeInTheDocument();

    expect(employeeId).toHaveValue("");
    expect(name).toHaveValue("");

    expect(employeeId).not.toBeDisabled();
    expect(name).not.toBeDisabled();
});

test("should display fields with value when user types", async () => {
    const mockedEmployeeId = "11111";
    const mockedName = "test_name";
    const mockedDepartment2: IDepartment = { id: 2, name: "test_dep_name2" };

    const scope = fork({
        values: new Map()
            .set($isModalActive, true)
            .set($isLoading, false)
            .set($departments, [mockedDepartment, mockedDepartment2]),
    });

    render(<TestWrapper scope={scope} children={<NewEmployee />} />);

    const employeeId = selectors.employeeId();
    const name = selectors.name();
    let departmentPlaceholder = screen.getAllByText(mockedDepartment.name)[0];
    const departmentItem2 = screen.getByText(mockedDepartment2.name);

    await act(async () => {
        await user.type(employeeId, mockedEmployeeId);
        await user.type(name, mockedName);
        await user.click(departmentPlaceholder);
        await user.click(departmentItem2);
    });

    departmentPlaceholder = screen.getAllByText(mockedDepartment2.name)[0];

    expect(departmentPlaceholder.textContent).toEqual(mockedDepartment2.name);

    expect(employeeId).toHaveValue(mockedEmployeeId);
    expect(name).toHaveValue(mockedName);
});

describe("form validation", () => {
    const scope = fork({
        values: new Map()
            .set($isModalActive, true)
            .set($isLoading, false)
            .set($departments, [mockedDepartment]),
    });

    test("should display error when employee id is less than 5 symbols", async () => {
        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const employeeId = selectors.employeeId();

        await act(async () => {
            await user.type(employeeId, "123");
            await user.tab();
        });

        const errorMessage = screen.getByText(/Введите 5-значное значение/i);

        expect(errorMessage).toBeInTheDocument();
    });

    test("should NOT allow user to type employee id more than 5 symbols", async () => {
        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const employeeId = selectors.employeeId();

        await act(async () => {
            await user.type(employeeId, "123456");
        });

        expect(employeeId).toHaveValue("12345");
    });

    test("should display required error when employee id is empty", async () => {
        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const employeeId = selectors.employeeId();

        await act(async () => {
            await user.click(employeeId);
            await user.tab();
        });

        const errorMessage = screen.getByText(/Обязательное поле/i);

        expect(errorMessage).toBeInTheDocument();
    });

    test("should display required error when employee name is empty", async () => {
        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const name = selectors.name();

        await act(async () => {
            await user.click(name);
            await user.tab();
        });

        const errorMessage = screen.getByText(/Обязательное поле/i);

        expect(errorMessage).toBeInTheDocument();
    });
});

describe("events", () => {
    test("modalOpened", async () => {
        const modalOpenedFn = jest.fn();
        modalOpened.watch(modalOpenedFn);

        const scope = fork();

        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const openButton = screen.getByRole("button", {
            name: /добавить/i,
        });

        await user.click(openButton);

        expect(modalOpenedFn).toBeCalledTimes(1);
    });

    test("modalClosed", async () => {
        const modalClosedFn = jest.fn();
        modalClosed.watch(modalClosedFn);

        const scope = fork({ values: new Map().set($isModalActive, true) });

        render(<TestWrapper scope={scope} children={<NewEmployee />} />);

        const closeButton = screen.getAllByRole("button")[0];

        await user.click(closeButton);

        expect(modalClosedFn).toBeCalledTimes(1);
    });
});
