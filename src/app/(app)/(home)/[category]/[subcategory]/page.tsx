
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting


import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/products-list'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{ category: string, subcategory: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
}

async function Page({ params }: Props) {
    const { category, subcategory } = await params

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
    }))

    // destructuring the category from await params

    // http://localhost:3000/education/test-preparation
    // http://localhost:3000/{category}/{subcategory}



    return (
        <div>
            Category : {category} <br />
            SubCategory: {subcategory}
            <br />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<ProductListSkeleton />}>
                    <ProductList category={subcategory} />
                </Suspense>
            </HydrationBoundary>

        </div>
    )
}

export default Page
