
import type { SearchParams } from 'nuqs/server'
import { getQueryClient, trpc } from '@/trpc/server'

import { loadProductFilters } from '@/modules/products/search-params'
import { DEFAULT_LIMIT } from '@/constants'
import { ProductListView } from '@/modules/products/ui/views/product-list-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export const dynamic = "force-dynamic"
interface Props {
    searchParams: Promise<SearchParams>
    params: Promise<{ slug: string }>
}

const page = async ({ params, searchParams }: Props) => {

    const { slug } = await params
    // console.log("the tenant is :", slug)
    const filters = await loadProductFilters(searchParams)

    const queryClient = getQueryClient()

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        tenantSlug: slug,
        limit: DEFAULT_LIMIT,
        // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
    }))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView tenantSlug={slug} narrowView />
        </HydrationBoundary>
    )



}

export default page
