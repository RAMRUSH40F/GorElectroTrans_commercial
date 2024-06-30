import PlanReport from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { fork } from "effector";
import TestWrapper from "tests/TestWrapper";

import {
    $error,
    $isModalActive,
    modalClosed,
    modalOpened,
} from "./model/model";

const mockedMessage = "Something went wrong";

let user: UserEvent;
const submitFn = jest.fn();

beforeEach(() => {
    user = userEvent.setup();
    submitFn.mockClear();
});

test("should display modal when state is active", () => {
    const scope = fork({ values: new Map().set($isModalActive, true) });

    render(<TestWrapper scope={scope} children={<PlanReport />} />);

    const title = screen.getByRole("heading", { name: /отчетность/i });

    expect(title).toBeInTheDocument();
});

test("should NOT display modal when state is not active", () => {
    const scope = fork({ values: new Map().set($isModalActive, false) });

    render(<TestWrapper scope={scope} children={<PlanReport />} />);

    const title = screen.queryByRole("heading", { name: /отчетность/i });

    expect(title).not.toBeInTheDocument();
});

test("should display error when it is not null", () => {
    const scope = fork({
        values: new Map().set($isModalActive, true).set($error, mockedMessage),
    });

    render(<TestWrapper scope={scope} children={<PlanReport />} />);

    const error = screen.getByText(mockedMessage);

    expect(error).toBeInTheDocument();
});

describe("events", () => {
    test("modalOpened", async () => {
        const modalOpenedFn = jest.fn();
        modalOpened.watch(modalOpenedFn);

        const scope = fork();

        render(<TestWrapper scope={scope} children={<PlanReport />} />);

        const openButton = screen.getByRole("button", {
            name: /Сформировать отчет/i,
        });

        await user.click(openButton);

        expect(modalOpenedFn).toBeCalledTimes(1);
    });

    test("modalClosed", async () => {
        const modalClosedFn = jest.fn();
        modalClosed.watch(modalClosedFn);

        const scope = fork({ values: new Map().set($isModalActive, true) });

        render(<TestWrapper scope={scope} children={<PlanReport />} />);

        const closeButton = screen.getAllByRole("button")[0];

        await user.click(closeButton);

        expect(modalClosedFn).toBeCalledTimes(1);
    });
});
