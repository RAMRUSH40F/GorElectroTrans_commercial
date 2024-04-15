import { transformSortToString } from ".";

const comma = "%2C";

test("should return empty string when all sort properties are disabled", () => {
    const paramsString = transformSortToString({
        title: "disabled",
        department: "disabled",
    });

    expect(paramsString).toEqual("");
});

test("should return transformed sort property when it is enabled", () => {
    const paramsStringAsc = transformSortToString({ title: "asc" });
    const paramsStringDesc = transformSortToString({ name: "desc" });

    expect(paramsStringAsc).toEqual(`sort=title${comma}asc`);
    expect(paramsStringDesc).toEqual(`sort=name${comma}desc`);
});

test("should return combined string with multiple sort properties", () => {
    const paramsString = transformSortToString({ title: "asc", name: "desc" });

    expect(paramsString).toEqual(`sort=title${comma}asc&sort=name${comma}desc`);
});
