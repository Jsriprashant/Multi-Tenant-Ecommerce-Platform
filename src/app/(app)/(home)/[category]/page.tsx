
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting


import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/products-list'
import { ProductFilters } from '@/modules/products/ui/components/product-filters'

import React from 'react'
import { Suspense } from 'react'

interface Props {
    params: Promise<{ category: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
}

//  http://localhost:3000/drawing-painting
//  http://localhost:3000/{category}


async function Page({ params }: Props) {
    const { category } = await params


    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category,
    }))

    // destructuring the category from await params

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className='px-4 lg:px-12 py-8 flex flex-col gap-4'>
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
