import { useQueryStates, parseAsString, createLoader, parseAsArrayOf, parseAsStringLiteral } from "nuqs";

const sortValues = ["curated", "trending", "hot_and_new"] as const

export const params = {
    sort: parseAsStringLiteral(sortValues).withDefault("curated"),
    minPrice: parseAsString.withOptions({
        clearOnDefault: true,
    }).withDefault(""),
    maxPrice: parseAsString.withOptions({
        clearOnDefault: true,
    }).withDefault(""),
    tags: parseAsArrayOf(parseAsString).withOptions({
        clearOnDefault: true
    }).withDefault([]),
}

export const useProductFilter = () => {
    return useQueryStates(params);
}

export const loadProductFilters = createLoader(params)

// these search params are from client 