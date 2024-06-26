export type DateRangeFormState = {
    startDate: Date;
    endDate: Date;
};

export type Props = {
    onSubmit: (data: DateRangeFormState) => Promise<void>;
};
