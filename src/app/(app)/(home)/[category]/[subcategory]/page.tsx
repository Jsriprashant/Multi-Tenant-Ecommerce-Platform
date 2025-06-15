
// when eveer we click on a category it will go to http://localhost:3000/drawing-painting



import { DEFAULT_LIMIT } from '@/constants'
import { loadProductFilters } from '@/modules/products/search-params'
import { ProductListView } from '@/modules/products/ui/views/product-list-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs'


interface Props {
    params: Promise<{ category: string, subcategory: string }>

    // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
    searchParams: Promise<SearchParams>
}
async function Page({ params, searchParams }: Props) {
    const { subcategory } = await params

    const filters = await loadProductFilters(searchParams)

    // console.log(JSON.stringify(filters), "THis is from RFC")


    const queryClient = getQueryClient()
    // void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    //     category: subcategory,
    //     ...filters
    //     // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
    // }))
    // now as in the components we are using infinite queries so we cannot usePrefetch we must use infinite predetch

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        category: subcategory,
        limit: DEFAULT_LIMIT
        // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
    }))

    // destructuring the category from await params

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory} />
        </HydrationBoundary>
    )
}

// async function Page({ params }: Props) {
//     const { category, subcategory } = await params

//     const queryClient = getQueryClient()
//     void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
//         category: subcategory,
//     }))

//     // destructuring the category from await params

//     // http://localhost:3000/education/test-preparation
//     // http://localhost:3000/{category}/{subcategory}



//     return (
//         <div>
//             Category : {category} <br />
//             SubCategory: {subcategory}
//             <br />
//             <HydrationBoundary state={dehydrate(queryClient)}>
//                 <Suspense fallback={<ProductListSkeleton />}>
//                     <ProductList category={subcategory} />
//                 </Suspense>
//             </HydrationBoundary>

//         </div>
//     )
// }

export default Page
