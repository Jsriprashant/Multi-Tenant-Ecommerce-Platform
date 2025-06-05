
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting


import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/products-list'

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
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductList category={category} />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page
