
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting


import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/products-list'
import { ProductFilters } from '@/modules/products/ui/components/product-filters'

import React from 'react'
import { Suspense } from 'react'
import type { SearchParams } from 'nuqs/server'
// import { loadProductFilters } from '@/modules/products/hooks/product-filter-hooks'
import { loadProductFilters } from '@/modules/products/search-params'
import { ProductSort } from '@/modules/products/ui/components/product-sort'

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
            <div className='px-4 lg:px-12 py-8 flex flex-col gap-4'>

                <div className='flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between'>
                    <p className='text-2xl font-medium'>
                        Curated for You

                    </p>
                    <ProductSort />
                </div>



                <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12'>
                    <div className='lg:col-span-2 xl:col-span-2'>


                        <ProductFilters />

                    </div>
                    <div className='lg:col-span-4 xl:col-span-6'>

                        <Suspense fallback={<ProductListSkeleton />}>
                            <ProductList category={category} />
                        </Suspense>
                    </div>

                </div>

            </div>
        </HydrationBoundary>
    )
}

export default Page
