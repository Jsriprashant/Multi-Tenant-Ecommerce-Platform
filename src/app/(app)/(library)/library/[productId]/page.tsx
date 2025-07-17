
import { ProductView } from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface props {
    params: Promise<{ productId: string }>
}


async function Page({ params }: props) {

    const { productId } = await params


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.library.getOne.queryOptions(
        {
            productId
        }
    ))

    void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({ productId }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId} />
        </HydrationBoundary>
    )
}

export default Page
