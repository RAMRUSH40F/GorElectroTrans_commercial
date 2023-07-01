import { formatDate } from ".";

test("should return formatted version when recieves correct date", () => {
    expect(formatDate("2023-12-10")).toEqual("10.12.2023");
});

test("should return empty string when recieves empty date", () => {
    expect(formatDate("")).toEqual("");
});

test("should return the same string when there is not symbols '-' ", () => {
    expect(formatDate("1234")).toEqual("1234");
});
