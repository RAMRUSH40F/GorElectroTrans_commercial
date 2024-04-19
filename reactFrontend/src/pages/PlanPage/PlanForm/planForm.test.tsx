import { ReactElement } from "react";

import PlanForm from ".";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PLAN_STATUS, PLAN_STATUS_VALUE } from "models/Plan";

const selectors = {
    form: () => screen.getByRole("form", { name: /рабочий план/i }),
    submitButton: () => screen.getByRole("button", { name: /добавить/i }),
    comment: () =>
        screen.getByRole("textbox", {
            name: /комментарий/i,
        }),
};

const submitFn = jest.fn();

beforeEach(() => {
    submitFn.mockClear();
});

const setup = (ui?: ReactElement) => {
    return {
        user: userEvent.setup(),
        ...render(ui ?? <PlanForm onSubmit={submitFn} />),
    };
};

test("should display form", () => {
    setup();

    const form = selectors.form();
    const submitButton = selectors.submitButton();

    expect(form).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
});

describe("fields", () => {
    test("should render 'topic' field", async () => {
        const { user } = setup();

        const topic = screen.getByRole("textbox", { name: /тема занятия/i });

        expect(topic).toBeInTheDocument();
        expect(topic).not.toBeDisabled();
        expect(topic).toHaveValue("");

        const topicText = "test_topic";

        await act(() => user.type(topic, topicText));

        expect(topic).toHaveValue(topicText);
    });

    test("should render 'date' field", () => {
        setup();

        const date = screen.getByRole("textbox", { name: /дата/i });

        expect(date).toBeInTheDocument();
        expect(date).not.toBeDisabled();
    });

    test("should render 'duration' field", async () => {
        const { user } = setup();

        const duration = screen.getByRole("textbox", {
            name: /Длительность\/ч./i,
        });

        expect(duration).toBeInTheDocument();
        expect(duration).not.toBeDisabled();
        expect(duration).toHaveValue("1");

        await act(() => user.type(duration, ".5"));

        expect(duration).toHaveValue("1.5");
    });

    test("should render 'peoplePlanned' field", async () => {
        const { user } = setup();

        const peoplePlanned = screen.getByRole("textbox", {
            name: /кол-во людей/i,
        });

        expect(peoplePlanned).toBeInTheDocument();
        expect(peoplePlanned).not.toBeDisabled();
        expect(peoplePlanned).toHaveValue("10");

        await act(() => user.type(peoplePlanned, "5"));

        expect(peoplePlanned).toHaveValue("105");
    });

    test("should render 'teacher' field", async () => {
        const { user } = setup();

        const teacher = screen.getByRole("textbox", {
            name: /фио преподавателя/i,
        });

        expect(teacher).toBeInTheDocument();
        expect(teacher).not.toBeDisabled();
        expect(teacher).toHaveValue("");

        const teacherText = "test_teacher";

        await act(() => user.type(teacher, teacherText));

        expect(teacher).toHaveValue(teacherText);
    });

    test("should render 'teacherPost' field", () => {
        setup();

        const teacherPost = screen.getByLabelText(/должность преподавателя/i);

        expect(teacherPost).toBeInTheDocument();
        expect(teacherPost).not.toBeDisabled();
    });

    test("should render 'status' field", () => {
        setup(<PlanForm isEditing={true} onSubmit={submitFn} />);

        const status = screen.getByLabelText(/статус занятия/i);

        expect(status).toBeInTheDocument();
        expect(status).not.toBeDisabled();
    });

    test("should render 'comment' field when status is 'rescheduled' or 'cancelled'", async () => {
        const { user } = setup(
            <PlanForm isEditing={true} onSubmit={submitFn} />,
        );

        const status = screen.getByLabelText(/статус занятия/i);

        const rescheduledStatus = screen.getByText(
            PLAN_STATUS_VALUE[PLAN_STATUS.RESCHEDULED],
        );
        const cancelledStatus = screen.getByText(
            PLAN_STATUS_VALUE[PLAN_STATUS.CANCELLED],
        );

        await act(async () => {
            await user.click(status);
            await user.click(rescheduledStatus);
        });

        const visibleComment = selectors.comment();

        expect(visibleComment).toBeInTheDocument();
        expect(visibleComment).not.toBeDisabled();
        
        await act(async () => {
          await user.click(status);
            await user.click(cancelledStatus);
        });

        const invisibleComment = screen.queryByRole("textbox", {
            name: /комментарий/i,
        });
        
        expect(invisibleComment).toBeInTheDocument();
        expect(visibleComment).not.toBeDisabled();
    });

    test("should NOT render 'comment' field when status is 'planned' or 'held'", async () => {
        const { user } = setup(
            <PlanForm isEditing={true} onSubmit={submitFn} />,
        );

        const status = screen.getByLabelText(/статус занятия/i);

        const plannedStatus = screen.getByRole("listitem", {
            name: (_, element) =>
                element.textContent === PLAN_STATUS_VALUE[PLAN_STATUS.PLANNED],
        });
        const heldStatus = screen.getByText(
            PLAN_STATUS_VALUE[PLAN_STATUS.HELD],
        );

        await act(async () => {
            await user.click(status);
            await user.click(plannedStatus);
        });

        const visibleComment = screen.queryByRole("textbox", {
            name: /комментарий/i,
        });

        expect(visibleComment).not.toBeInTheDocument();

        await act(async () => {
            await user.click(status);
            await user.click(heldStatus);
        });

        const invisibleComment = screen.queryByRole("textbox", {
            name: /комментарий/i,
        });

        expect(invisibleComment).not.toBeInTheDocument();
    });
});
