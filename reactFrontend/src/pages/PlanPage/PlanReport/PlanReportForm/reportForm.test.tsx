import PlanReportForm from ".";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { Scope, fork } from "effector";
import TestWrapper from "tests/TestWrapper";

import {
    $activeOption,
    $error,
    $isSubmitting,
    $periodsOptions,
    activeOptionChanged,
    formSubmitted,
} from "./model/model";

const selectors = {
    submitButton: () => screen.getByRole("button", { name: /скачать/i }),
    periodsSelect: () => screen.getByRole("combobox"),
};

const mockedMessage = "Something went wrong";

let user: UserEvent;

beforeEach(() => {
    user = userEvent.setup();
});

test("should disaplay form", () => {
    const scope = fork({
        values: new Map().set($activeOption, {
            label: "test_label",
            value: "test_value",
        }),
    });

    render(<TestWrapper scope={scope} children={<PlanReportForm />} />);

    const form = screen.getByRole("form", { name: /отчетность/i });
    const select = selectors.periodsSelect();
    const submitButton = selectors.submitButton();

    expect(form).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    expect(select).not.toBeDisabled();
    expect(submitButton).not.toBeDisabled();
});

test("should disable form while submitting", () => {
    const scope = fork({
        values: new Map()
            .set($activeOption, {
                label: "test_label",
                value: "test_value",
            })
            .set($isSubmitting, true),
    });

    render(<TestWrapper scope={scope} children={<PlanReportForm />} />);

    const select = selectors.periodsSelect();
    const submitButton = selectors.submitButton();

    expect(select).toBeDisabled();
    expect(submitButton).toBeDisabled();
});

test("should display error when it is not empty", () => {
    const scope = fork({
        values: new Map().set($error, mockedMessage),
    });

    render(<TestWrapper scope={scope} children={<PlanReportForm />} />);

    const error = screen.getByText(mockedMessage);

    expect(error).toBeInTheDocument();
});

describe("events", () => {
    let scope: Scope;
    const mockedOption = { label: "test_label", value: "test_value" };
    const mockedOption2 = { label: "test_label_2", value: "test_value_2" };

    beforeEach(() => {
        scope = fork({
            values: new Map()
                .set($periodsOptions, [mockedOption, mockedOption2])
                .set($activeOption, {
                    label: "test_label",
                    value: "test_value",
                }),
        });
    });

    test("formSubmitted", async () => {
        const formSubmittedFn = jest.fn();
        formSubmitted.watch(formSubmittedFn);

        render(<TestWrapper scope={scope} children={<PlanReportForm />} />);

        const submitButton = selectors.submitButton();

        await user.click(submitButton);

        expect(formSubmittedFn).toBeCalledTimes(1);
    });

    test("activeOptionChanged", async () => {
        const activeOptionChangedFn = jest.fn();
        activeOptionChanged.watch(activeOptionChangedFn);

        render(<TestWrapper scope={scope} children={<PlanReportForm />} />);

        const activeOption = screen.getAllByText(mockedOption.label)[0];
        const optionToSelect = screen.getByText(mockedOption2.label);

        await act(async () => {
            await user.click(activeOption);
            await user.click(optionToSelect);
        });

        expect(activeOptionChangedFn).toBeCalledTimes(1);
        expect(activeOptionChangedFn).toBeCalledWith(mockedOption2);
    });
});
