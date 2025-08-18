'use client'

import { SearchInput } from "./search-index"
import { Categories } from "./categories"
// import { CustomCategory } from "../types"

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useParams } from "next/navigation";
import { default_bg_color } from "@/modules/home/constants";
import { BreadCrumbNavigation } from "./breadCrumb-navigation";
import { useProductFilter } from "@/modules/products/hooks/product-filter-hooks";

// interface props {
//     data: CustomCategory[]
// }

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const [filters, setFilters] = useProductFilter();


    const params = useParams();
    const categoryParams = params.category as string || undefined
    const activeCategory = categoryParams || "all"

    const activeCategoryData = data.find((category) => category.slug === activeCategory)

    const activeCategoryName = activeCategoryData?.name || null;

    const activeCategoryColour = activeCategoryData?.color || default_bg_color

    const activeSubcategory = params.subcategory as string || undefined
    const activeSubcategorynName = activeCategoryData?.subcategories.find(
        (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null



    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
            backgroundColor: activeCategoryColour
        }}>
            <SearchInput defaultValue={filters.search} onChange={(value) => setFilters({ search: value })} />
            <div className="hidden lg:block">
                <Categories data={data} />
            </div>
            {/* now we will add a text so that user knows in which category he is in */}
            <BreadCrumbNavigation activeCategory={activeCategory} activeCategoryName={activeCategoryName} activeSubcategoryName={activeSubcategorynName} />

        </div>
    )
}

export const SearchFilterLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
            backgroundColor: "#f5f5f5"
        }}>
            <SearchInput disabled />
            <div className="hidden lg:block">
                <div className="h-11"></div>
            </div>

        </div>
    )
}

