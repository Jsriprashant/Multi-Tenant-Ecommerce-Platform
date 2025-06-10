'use client'

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useProductFilter } from "../../hooks/product-filter-hooks"

interface Props {
    category?: string

}

export const ProductList = ({ category }: Props) => {

    const [filters] = useProductFilter();
    // we destructure the filters useProductFilter hooks

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({
        category,
        ...filters
        // we can pass the filters to the getmany funciton of products server procedure
        // but we have to do prefetch also so that loading is instantaneoues

    }))

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

            {
                data?.docs.map((product) => (
                    <div key={product.id} className="border rounded-md bg-white p-4">
                        <h2 className="text-xl font-medium">{product.name}</h2>
                        <p>Rs {product.price}</p>

                    </div>
                )

                )
            }

        </div>
    )

}

export const ProductListSkeleton = () => {
    return (
        <div>
            Loading.....
        </div>
    )
}