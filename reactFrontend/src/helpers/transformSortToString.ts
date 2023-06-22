import { SortOrder } from "components/SortButton";

interface TypedSortObject {
    [index: string]: SortOrder;
}

export const transformSortToString = (sort: TypedSortObject) => {
    const query = new URLSearchParams();
    for (const key in sort) {
        const order = sort[key];
        if (order === "disabled") continue;
        query.append("sort", `${key},${order}`);
    }
    return query.toString();
};
