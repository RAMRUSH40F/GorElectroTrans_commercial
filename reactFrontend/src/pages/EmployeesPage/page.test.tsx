import { act, render, screen, within } from "@testing-library/react";
import { fork } from "effector";
import EmployeesPage from ".";
import TestWrapper from "tests/TestWrapper";
import RouterWrapper from "tests/RouterWrapper";
import { IEmployee } from "models/Employee";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import {
    $employees,
    $error,
    $isFetching,
    $isLoading,
    $search,
    $totalPages,
    pageChanged,
    pageLoaded,
    searchChanged,
    sortToggled,
} from "./model/employeesModel";

const selectors = {
    search: () => screen.getByPlaceholderText(/поиск/i),
    table: () => screen.getByRole("table"),
    pagination: () => screen.getByRole("navigation", { name: /pagination/i }),
    paginationButtons() {
        return within(this.pagination()).getAllByRole("button");
    },
};

const mockedEmployee: IEmployee = {
    fullName: "test_name",
    studentId: "test_id",
    subdepartmentName: "test_subname",
};

let user: UserEvent;

beforeEach(() => {
    user = userEvent.setup();
});

test("should render on default states", () => {
    render(<EmployeesPage />, { wrapper: RouterWrapper });

    const title = screen.getByRole("heading", { name: /Работники/i });
    const alert = screen.getByText(/На текущий момент нет ни одной записи/i);
    const search = selectors.search();

    expect(title).toBeInTheDocument();
    expect(alert).toBeInTheDocument();
    expect(search).toHaveValue("");
});

test("should display loader when loading is active", () => {
    const scope = fork({ values: new Map().set($isLoading, true) });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    expect(screen.getByText(/Загрузка/i));
});

test("should set opacity to table when fetching is active", () => {
    const scope = fork({
        values: new Map()
            .set($isFetching, true)
            .set($employees, [mockedEmployee]),
    });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    const table = selectors.table();
    const tableBody = within(table).getAllByRole("rowgroup")[1];

    expect(tableBody).toHaveClass("opacity");
});

test("should display search with value when store is not empty", () => {
    const mockedText = "test_search";

    const scope = fork({ values: new Map().set($search, mockedText) });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    expect(selectors.search()).toHaveValue(mockedText);
});

test("should display table when employees list is not empty", () => {
    const scope = fork({ values: new Map().set($employees, [mockedEmployee]) });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    const table = selectors.table();
    const nameCell = screen.getByText(mockedEmployee.fullName);
    const employeesList = scope.getState($employees);

    expect(table).toBeInTheDocument();
    expect(nameCell).toBeInTheDocument();

    expect(employeesList).toHaveLength(1);
});

test("should display pagination when totalPages more than 1", () => {
    const mockedTotalPages = 3;
    const expectedCount = mockedTotalPages + 2; // three page buttons + two invisible arrows (next, prev)

    const scope = fork({
        values: new Map().set($totalPages, mockedTotalPages),
    });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    const pagination = selectors.pagination();
    const paginationButtons = selectors.paginationButtons();

    expect(pagination).toBeInTheDocument();
    expect(paginationButtons).toHaveLength(expectedCount);
});

test("should not display pagination when totalPages less than 2", () => {
    const scope = fork({
        values: new Map().set($totalPages, 1),
    });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    const pagination = screen.queryByRole("navigation", {
        name: /pagination/i,
    });

    expect(pagination).not.toBeInTheDocument();
});

test("should display error alert when error is not empty", () => {
    const mockedError = "Something went wrong";

    const scope = fork({
        values: new Map().set($error, mockedError),
    });

    render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

    const table = screen.queryByRole("table");
    const error = screen.getByText(mockedError);

    expect(error).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
});

describe("event", () => {
    test("pageLoaded", () => {
        const pageLoadedFn = jest.fn();
        pageLoaded.watch(pageLoadedFn);

        const scope = fork();

        render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

        expect(pageLoadedFn).toBeCalledTimes(1);
    });

    test("searchChanged", async () => {
        const mockedText = "test_search";
        const searchFn = jest.fn();
        searchChanged.watch(searchFn);

        const scope = fork();

        render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

        const search = selectors.search();

        await act(async () => {
            await user.type(search, mockedText);
        });

        expect(searchFn).toHaveBeenCalledTimes(mockedText.length);
    });

    test("pageChanged", async () => {
        const pageChangedFn = jest.fn();
        pageChanged.watch(pageChangedFn);

        const scope = fork({ values: new Map().set($totalPages, 3) });

        render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

        const buttons = selectors.paginationButtons();

        await act(async () => {
            await user.click(buttons[2]);
            await user.click(buttons[3]);
        });

        expect(pageChangedFn).toBeCalledTimes(2);
    });

    test("sortToggled", async () => {
        const sortToggledFn = jest.fn();
        sortToggled.watch(sortToggledFn);

        const scope = fork({
            values: new Map().set($employees, [mockedEmployee]),
        });

        render(<TestWrapper scope={scope} children={<EmployeesPage />} />);

        const table = selectors.table();
        const nameColumn = within(table).getByRole("columnheader", {
            name: /фио/i,
        });

        await user.click(nameColumn);
        await user.click(nameColumn);
        await user.click(nameColumn);

        expect(sortToggledFn).toBeCalledTimes(3);
    });
});
