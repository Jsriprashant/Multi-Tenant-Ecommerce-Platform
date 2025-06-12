
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting


import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductListView } from '@/modules/products/ui/views/product-list-view'

import React from 'react'
import type { SearchParams } from 'nuqs/server'
// import { loadProductFilters } from '@/modules/products/hooks/product-filter-hooks'
import { loadProductFilters } from '@/modules/products/search-params'


interface Props {
    params: Promise<{ category: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
    searchParams: Promise<SearchParams>
}

//  http://localhost:3000/drawing-painting
//  http://localhost:3000/{category}


async function Page({ params, searchParams }: Props) {
    const { category } = await params

    const filters = await loadProductFilters(searchParams)

    // console.log(JSON.stringify(filters), "THis is from RFC")


    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category,
        ...filters
        // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
    }))

    // destructuring the category from await params

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={category} />
        </HydrationBoundary>
    )
}

export default Page
