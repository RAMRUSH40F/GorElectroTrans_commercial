import { attach, createDomain, merge, sample } from "effector";
import { createGate } from "effector-react";
import { IMaterial, IPlan, PlanDto } from "models/Plan";
import { debounce } from "patronum";
import { AbortParams } from "shared/api/types";
import planApi from "shared/api/planApi";
import { SortOrder } from "components/SortButton";
import { transformSortToString } from "helpers/transformSortToString";

type Sort = Record<keyof Pick<IPlan, "topic" | "teacher" | "date">, SortOrder>;

interface GateProps {
    depId: string;
    search: string;
    page: number;
}

const domain = createDomain();
export const planGate = createGate<GateProps>();

// #region Events
export const loadingStarted = domain.createEvent();
export const loadingEnded = domain.createEvent();

export const searchChanged = domain.createEvent<string>();
export const debouncedSearchChanged = domain.createEvent<string>();
export const initialSearchChanged = domain.createEvent<string>();
export const sortToggled = domain.createEvent<keyof Sort>();

export const pageChanged = domain.createEvent<number>();
export const paramsChanged = merge([
    debouncedSearchChanged,
    pageChanged,
    initialSearchChanged,
    sortToggled,
]);

export const depIdChanged = domain.createEvent<string>();

export const planFileAdded = domain.createEvent<IMaterial>();
export const planFileRemoved = domain.createEvent<IMaterial>();
// #endregion

// #region Stores
export const $plans = domain.createStore<IPlan[]>([]);
export const $isLoading = domain.createStore<boolean>(false);
export const $isFetching = domain.createStore<boolean>(false);
export const $error = domain.createStore<string | null>(null);

export const $totalPages = domain.createStore<number>(0);
export const $page = domain.createStore<number>(1);
export const $size = domain.createStore<number>(20);
export const $search = domain.createStore<string>("");
export const $sort = domain.createStore<Sort>({
    date: "disabled",
    teacher: "disabled",
    topic: "disabled",
});

export const $depId = domain.createStore<string>("");
// #endregion

export const getPlanFx = attach({
    effect: planApi.fetchFx,
});

export const addPlanFx = attach({
    effect: planApi.postFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<PlanDto>, depId) {
        return { depId, data, controller };
    },
});

export const updatePlanFx = attach({
    effect: planApi.putFx,
    source: $depId,
    mapParams({ data, controller }: AbortParams<IPlan>, depId) {
        return { depId, data, controller };
    },
});

export const removePlanFx = attach({
    effect: planApi.deleteFx,
    source: $depId,
    mapParams({ controller, data }: AbortParams<number>, depId) {
        return {
            depId,
            data,
            controller,
        };
    },
});

const fetchStarted = merge([
    getPlanFx.pending,
    addPlanFx.pending,
    updatePlanFx.pending,
    removePlanFx.pending,
]);

// Set department id when accessing page
sample({
    clock: planGate.open,
    source: planGate.state,
    fn: ({ depId }) => depId,
    target: depIdChanged,
});

// Set search value from url search params when component is mounted
sample({
    clock: planGate.open,
    source: planGate.state,
    fn: ({ search }) => search,
    filter: ({ search }) => search !== $search.defaultState,
    target: initialSearchChanged,
});

// Change search value after 250ms when user stopped typing
debounce({
    source: searchChanged,
    target: debouncedSearchChanged,
    timeout: 250,
});

// Set page value from url search params when component is mounted
sample({
    clock: planGate.open,
    source: planGate.state,
    fn: ({ page }) => page,
    filter: ({ page }) => page !== $page.defaultState,
    target: pageChanged,
});

// Fetch plans data once when component is mounted
sample({
    clock: planGate.open,
    source: {
        depId: $depId,
        page: $page,
        size: $size,
        search: $search,
        sort: $sort,
    },
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
        sort: transformSortToString({ ...params.sort }),
    }),
    filter: ({ search, page, depId }) =>
        search === $search.defaultState &&
        page === $page.defaultState &&
        depId !== "",
    target: getPlanFx,
});

// Cancel fetch request when component is unmounted
sample({
    clock: planGate.close,
    source: getPlanFx,
}).watch(({ controller }) => controller.abort());

// Cancel fetch request when search or page change
sample({
    clock: paramsChanged,
    source: getPlanFx,
}).watch(({ controller }) => {
    controller.abort();
});

// Decrease page when the last attendance on the page was deleted
sample({
    clock: removePlanFx.done,
    source: { plans: $plans, page: $page },
    filter: ({ plans, page }) => plans.length === 1 && page > 1,
    fn: ({ page }) => page - 1,
    target: pageChanged,
});

// Fetch attendance when search params were changed or attendance was deleted or updated
sample({
    clock: [paramsChanged, removePlanFx.done, addPlanFx.done],
    source: {
        depId: $depId,
        page: $page,
        size: $size,
        search: $search,
        sort: $sort,
    },
    filter: ({ depId }) => depId !== "",
    fn: (params) => ({
        ...params,
        controller: new AbortController(),
        sort: transformSortToString({ ...params.sort }),
    }),
    target: getPlanFx,
});

// Set loading state when data is fetching
sample({
    clock: getPlanFx.pending,
    source: $plans,
    filter: (plans) => plans.length === 0,
    target: loadingStarted,
});

// Stop loading state when request completes
sample({
    clock: getPlanFx.done,
    target: loadingEnded,
});

// Stop loading state when request fails
sample({
    clock: getPlanFx.failData,
    filter: ({ isCanceled }) => !isCanceled,
    target: loadingEnded,
});

// Reset all stores when component unmountes
domain.onCreateStore(($store) => {
    $store.reset(planGate.close);
});

$isLoading.on(loadingStarted, () => true).on(loadingEnded, () => false);

$isFetching.on(fetchStarted, (_, pending) => pending);

$error
    .on(getPlanFx, () => null)
    .on(getPlanFx.failData, (_, { isCanceled, message }) =>
        isCanceled ? null : message
    );

$plans
    .on(getPlanFx.doneData, (_, { data }) => data)
    .on(updatePlanFx.doneData, (plans, data) =>
        plans.map((plan) => {
            if (plan.id === data.id) {
                return { ...plan, ...data };
            }
            return plan;
        })
    )
    .on(planFileAdded, (plans, { fileName, lessonId }) => {
        return plans.map((plan) => {
            if (plan.id === lessonId) {
                plan.lessonContent = [fileName, ...plan.lessonContent];
            }
            return plan;
        });
    })
    .on(planFileRemoved, (plans, { fileName, lessonId }) => {
        return plans.map((plan) => {
            if (plan.id === lessonId) {
                plan.lessonContent = plan.lessonContent.filter(
                    (name) => name !== fileName
                );
            }
            return plan;
        });
    });

$totalPages.on(getPlanFx.doneData, (_, { totalPages }) => totalPages);

$page.on(pageChanged, (_, page) => page).reset(debouncedSearchChanged);

$search
    .on(searchChanged, (_, value) => value)
    .on(initialSearchChanged, (_, value) => value);

$sort.on(sortToggled, (sort, property) => {
    switch (sort[property]) {
        case "disabled":
            return { ...sort, [property]: "desc" };
        case "desc":
            return { ...sort, [property]: "asc" };
        default:
            return { ...sort, [property]: "disabled" };
    }
});

$depId.on(depIdChanged, (_, id) => id);
