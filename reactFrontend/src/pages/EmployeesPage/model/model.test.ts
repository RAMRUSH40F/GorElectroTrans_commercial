import { Scope, allSettled, fork } from "effector";

import { IEmployee } from "models/Employee";

import {
    $depId,
    $employees,
    $error,
    $page,
    $search,
    $sort,
    $totalPages,
    addEmployeeFx,
    debouncedSearchChanged,
    depIdChanged,
    fetchStarted,
    getEmployeesFx,
    initialSearchChanged,
    loadingEnded,
    loadingStarted,
    pageChanged,
    pageLoaded,
    paramsChanged,
    removeEmployeeFx,
    searchChanged,
    sortToggled,
} from "./model";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockedEmployee: IEmployee = {
    fullName: "test_name",
    studentId: "test_id",
    subdepartmentName: "test_subname",
};

// #region Watchers
const depIdChangedFn = jest.fn();
depIdChanged.watch(depIdChangedFn);

const pageChangedFn = jest.fn();
pageChanged.watch(pageChangedFn);

const initialSearchChangedFn = jest.fn();
initialSearchChanged.watch(initialSearchChangedFn);

const searchChangedFn = jest.fn();
searchChanged.watch(searchChangedFn);

const debouncedSearchChangedFn = jest.fn();
debouncedSearchChanged.watch(debouncedSearchChangedFn);

const sortToggledFn = jest.fn();
sortToggled.watch(sortToggledFn);

const getEmployeesFn = jest.fn();
getEmployeesFx.watch(getEmployeesFn);

const paramsChangedFn = jest.fn();
paramsChanged.watch(paramsChangedFn);

const fetchStartedFn = jest.fn();
fetchStarted.watch(fetchStartedFn);

const loadingStartedFn = jest.fn();
loadingStarted.watch(loadingStartedFn);

const loadingEndedFn = jest.fn();
loadingEnded.watch(loadingEndedFn);

const addEmployeeFn = jest.fn();
addEmployeeFx.watch(addEmployeeFn);

const removeEmployeeFn = jest.fn();
removeEmployeeFx.watch(addEmployeeFn);

beforeEach(() => {
    depIdChangedFn.mockClear();
    pageChangedFn.mockClear();
    initialSearchChangedFn.mockClear();
    searchChangedFn.mockClear();
    debouncedSearchChangedFn.mockClear();
    sortToggledFn.mockClear();
    getEmployeesFn.mockClear();
    paramsChangedFn.mockClear();
    fetchStartedFn.mockClear();
    loadingStartedFn.mockClear();
    loadingEndedFn.mockClear();
    addEmployeeFn.mockClear();
    removeEmployeeFn.mockClear();
});
// #endregion

describe("events", () => {
    const mockedSearch = "test_search";
    let scope: Scope;

    beforeEach(() => {
        scope = fork();
    });

    describe("pageLoaded", () => {
        test("should set depId when page was loaded", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => ({
                    data: [],
                    totalPages: 1,
                })),
            });

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "13", search: "", page: 1 },
            });

            expect(depIdChangedFn).toBeCalledTimes(1);
            expect(depIdChangedFn).toBeCalledWith("13");
            expect(scope.getState($depId)).toEqual("13");
        });

        test("should set page value when page was loaded and value !== defaultState", async () => {
            const getEmployeesFxFn = jest.fn();

            const scope = fork({
                handlers: new Map().set(getEmployeesFx, getEmployeesFxFn),
            });

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "", search: "", page: 5 },
            });

            expect(pageChangedFn).toBeCalledTimes(1);
            expect(pageChangedFn).toBeCalledWith(5);
            expect(scope.getState($page)).toEqual(5);
        });

        test("should not set page value when page was loaded and value === defaultState", async () => {
            const pageDefaultState = $page.defaultState;

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "", search: "", page: pageDefaultState },
            });

            expect(pageChangedFn).toBeCalledTimes(0);
            expect(scope.getState($page)).toEqual(pageDefaultState);
        });

        test("should set search value when page was loaded and value !== defaultState", async () => {
            const mockedSearch = "test_search";

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "", search: mockedSearch, page: 1 },
            });

            expect(initialSearchChangedFn).toBeCalledTimes(1);
            expect(initialSearchChangedFn).toBeCalledWith(mockedSearch);
            expect(scope.getState($search)).toEqual(mockedSearch);
        });

        test("should not set search value when page was loaded and value === defaultState", async () => {
            const searchDefaultState = $search.defaultState;

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "", search: searchDefaultState, page: 1 },
            });

            expect(initialSearchChangedFn).toBeCalledTimes(0);
            expect(scope.getState($search)).toEqual(searchDefaultState);
        });
    });

    test("searchChanged", async () => {
        await allSettled(searchChanged, { scope, params: mockedSearch });

        expect(searchChangedFn).toBeCalledTimes(1);
        expect(searchChangedFn).toBeCalledWith(mockedSearch);
        expect(scope.getState($search)).toEqual(mockedSearch);
    });

    test("debouncedSearchChanged", async () => {
        allSettled(searchChanged, { scope, params: "test_search" });
        allSettled(searchChanged, { scope, params: "test_search_2" });
        allSettled(searchChanged, { scope, params: "test_search_3" });

        expect(searchChangedFn).toBeCalledTimes(3);
        expect(debouncedSearchChangedFn).toBeCalledTimes(0);

        await wait(300);

        expect(debouncedSearchChangedFn).toBeCalledTimes(1);
        expect(debouncedSearchChangedFn).toBeCalledWith("test_search_3");
    });

    test("pageChanged", async () => {
        await allSettled(pageChanged, { scope, params: 13 });

        expect(pageChangedFn).toBeCalledTimes(1);
        expect(pageChangedFn).toBeCalledWith(13);
        expect(scope.getState($page)).toEqual(13);
    });

    test("depIdChanged", async () => {
        await allSettled(depIdChanged, { scope, params: "13" });

        expect(depIdChangedFn).toBeCalledTimes(1);
        expect(depIdChangedFn).toBeCalledWith("13");
        expect(scope.getState($depId)).toEqual("13");
    });

    test("sortToggled", async () => {
        await allSettled(sortToggled, { scope, params: "name" });

        expect(sortToggledFn).toBeCalledTimes(1);
        expect(sortToggledFn).toBeCalledWith("name");
        expect(scope.getState($sort)).toEqual({
            name: "desc",
            subdepartment: "disabled",
        });

        await allSettled(sortToggled, { scope, params: "name" });

        expect(sortToggledFn).toBeCalledTimes(2);
        expect(sortToggledFn).toBeCalledWith("name");
        expect(scope.getState($sort)).toEqual({
            name: "asc",
            subdepartment: "disabled",
        });

        await allSettled(sortToggled, { scope, params: "name" });

        expect(sortToggledFn).toBeCalledTimes(3);
        expect(sortToggledFn).toBeCalledWith("name");
        expect(scope.getState($sort)).toEqual({
            name: "disabled",
            subdepartment: "disabled",
        });
    });
});

describe("effects", () => {
    describe("getEmployeesFx", () => {
        const mockedMessage = "Something went wrong";
        const mockedParams = {
            controller: new AbortController(),
            depId: "1",
            page: 1,
            search: "",
            size: 5,
        };

        test("should send request when page was loaded and stores have default states", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    getEmployeesFn();
                    return { data: [mockedEmployee], totalPages: 1 };
                }),
            });

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "13", page: 1, search: "" },
            });

            expect(paramsChangedFn).toBeCalledTimes(0);
            expect(getEmployeesFn).toBeCalledTimes(2);

            expect(scope.getState($employees)).toEqual([mockedEmployee]);
            expect(scope.getState($totalPages)).toEqual(1);
        });

        test("should send request when page was loaded and stores do not have default states", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    getEmployeesFn();
                    return { data: [mockedEmployee], totalPages: 4 };
                }),
            });

            await allSettled(pageLoaded, {
                scope,
                params: { depId: "13", page: 3, search: "test_search" },
            });

            expect(paramsChangedFn).toBeCalledTimes(2);
            expect(getEmployeesFn).toBeCalledTimes(2);

            expect(scope.getState($employees)).toEqual([mockedEmployee]);
            expect(scope.getState($totalPages)).toEqual(4);
        });

        test("should set error when request fails", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    getEmployeesFn();
                    const error = {
                        isCanceled: false,
                        message: mockedMessage,
                    };
                    throw error;
                }),
            });

            await allSettled(getEmployeesFx, {
                scope,
                params: mockedParams,
            });

            expect(getEmployeesFn).toBeCalledTimes(2);
            expect(getEmployeesFn).toBeCalledWith(mockedParams);
            expect(scope.getState($error)).toEqual(mockedMessage);
        });

        test("should not set error if request was canceled", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    getEmployeesFn();
                    const error = {
                        isCanceled: true,
                        message: mockedMessage,
                    };
                    throw error;
                }),
            });

            await allSettled(getEmployeesFx, {
                scope,
                params: mockedParams,
            });

            expect(getEmployeesFn).toBeCalledTimes(2);
            expect(getEmployeesFn).toBeCalledWith(mockedParams);
            expect(scope.getState($error)).toEqual(null);
        });

        test("should trigger fetchStarted when request is pending", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    getEmployeesFn();
                    return { data: [], totalPages: 1 };
                }),
            });

            await allSettled(getEmployeesFx, {
                scope,
                params: mockedParams,
            });

            expect(getEmployeesFn).toBeCalledTimes(2);
            expect(getEmployeesFn).toBeCalledWith(mockedParams);
            expect(fetchStartedFn).toBeCalledTimes(2);
        });

        test("should trigger loadingStarted when request is pending and employees list is empty", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    return { data: [], totalPages: 1 };
                }),
            });

            await allSettled(getEmployeesFx, {
                scope,
                params: mockedParams,
            });

            expect(getEmployeesFn).toBeCalledTimes(1);
            expect(getEmployeesFn).toBeCalledWith(mockedParams);
            expect(loadingStartedFn).toBeCalledTimes(2);
        });

        test("should trigger loadingEnded when request finishes", async () => {
            const scope = fork({
                handlers: new Map().set(getEmployeesFx, () => {
                    return { data: [], totalPages: 1 };
                }),
            });

            await allSettled(getEmployeesFx, {
                scope,
                params: mockedParams,
            });

            expect(getEmployeesFn).toBeCalledTimes(1);
            expect(getEmployeesFn).toBeCalledWith(mockedParams);
            expect(loadingEndedFn).toBeCalledTimes(1);
        });
    });

    describe("addEmployeeFx", () => {
        const mockedParams = {
            controller: new AbortController(),
            data: mockedEmployee,
            depId: "1",
        };

        test("should trigger fetchStarted when request is pending", async () => {
            const scope = fork({
                values: new Map().set($depId, "1"),
                handlers: new Map()
                    .set(addEmployeeFx, addEmployeeFn)
                    .set(getEmployeesFx, () => {
                        return { data: [], totalPages: 1 };
                    }),
            });

            await allSettled(addEmployeeFx, {
                scope,
                params: mockedParams,
            });

            expect(addEmployeeFn).toBeCalledTimes(2);
            expect(addEmployeeFn).toBeCalledWith("1", mockedParams);
            expect(fetchStartedFn).toBeCalledTimes(4);
        });

        test("should refetch data when new employee was added", async () => {
            const scope = fork({
                values: new Map().set($depId, "1"),
                handlers: new Map()
                    .set(getEmployeesFx, () => {
                        getEmployeesFn();
                        return { data: [], totalPages: 1 };
                    })
                    .set(addEmployeeFx, addEmployeeFn),
            });

            await allSettled(addEmployeeFx, {
                scope,
                params: mockedParams,
            });

            expect(addEmployeeFn).toBeCalledTimes(2);
            expect(addEmployeeFn).toBeCalledWith("1", mockedParams);
            expect(getEmployeesFn).toBeCalledTimes(2);
        });
    });

    describe("removeEmployeeFx", () => {
        const mockedParams = {
            controller: new AbortController(),
            data: "1",
            depId: "1",
        };

        test("should trigger fetchStarted when request is pending", async () => {
            const scope = fork({
                values: new Map().set($depId, "1"),
                handlers: new Map()
                    .set(getEmployeesFx, () => {
                        return { data: [], totalPages: 1 };
                    })
                    .set(removeEmployeeFx, removeEmployeeFn),
            });

            await allSettled(removeEmployeeFx, {
                scope,
                params: mockedParams,
            });

            expect(removeEmployeeFn).toBeCalledTimes(1);
            expect(removeEmployeeFn).toBeCalledWith("1", mockedParams);
            expect(fetchStartedFn).toBeCalledTimes(4);
        });

        test("should refetch data when new employee was deleted", async () => {
            const scope = fork({
                values: new Map().set($depId, "1"),
                handlers: new Map()
                    .set(getEmployeesFx, () => {
                        getEmployeesFn();
                        return { data: [], totalPages: 1 };
                    })
                    .set(removeEmployeeFx, removeEmployeeFn),
            });

            await allSettled(removeEmployeeFx, {
                scope,
                params: mockedParams,
            });

            expect(removeEmployeeFn).toBeCalledTimes(1);
            expect(removeEmployeeFn).toBeCalledWith("1", mockedParams);
            expect(getEmployeesFn).toBeCalledTimes(2);
        });
    });
});
