import { ProductViewSkeleton } from "@/modules/products/ui/views/product-view";
// import { ProductWrapper } from "@/modules/products/ui/views/product-wrapper";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
export const dynamic = "force-dynamic"
import { ProductView } from "@/modules/products/ui/views/product-view";

interface Props {
    params: Promise<{ productId: string, slug: string }>
    // we can extract slug because this productId folder is the child of slug folder and as we know information passes from parent to child


}

const Page = async ({ params }: Props) => {

    const { productId, slug } = await params

    const queryClient = getQueryClient();

    // void queryClient.prefetchQuery(trpc.products.getOne.queryOptions({
    //     id: productId

    // }))
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug,

    }))

    return (
        <Suspense fallback={<ProductViewSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/* <ProductWrapper initialProductId={productId} initialSlug={slug} /> */}
                <ProductView productId={productId} tenantSlug={slug} />
            </HydrationBoundary>
        </Suspense>

    )

}

export default Page