"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "../../hooks/use-cart"
import { useEffect } from "react"
import { toast } from "sonner"
import { generateTenantURL } from "@/lib/utils"
import { CheckoutItem } from "../components/checkout-item"
import { CheckoutSidebar } from "../components/checkout-sidebar"
import { InboxIcon, LoaderIcon } from "lucide-react"

interface props {
    tenantSlug: string
}


export const CheckoutView = ({ tenantSlug }: props) => {

    const { productIds, clearAllcarts, removeAProduct } = useCart(tenantSlug)

    const trpc = useTRPC()
    const { data, error, isLoading } = useQuery(trpc.checkout.getProducts.queryOptions(
        {
            ids: productIds,
        }
    ))
    // we are not using any prefetch suspence because the productIds are coming from local storage so no need to use prefectch, as prefetch is used only when.

    // now what if teh tenant deletes the product from store then, the product may still be in user's cart, which should not be allowed, so we clear the localStorage of the user

    useEffect(() => {
        if (error?.data?.code === 'NOT_FOUND') {

            clearAllcarts()
            toast.warning("Invalid Products Found, Cart Cleared")
        }
    }, [error, clearAllcarts])

    if (isLoading) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">

                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg ">
                    <LoaderIcon className="text-muted-foreground animate-spin" />
                </div>
            </div>
        )
    }

    // if data is not present
    if (data?.totalDocs == 0 || !data) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">

                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg ">
                    <InboxIcon />
                    <p className="text-base font-medium" >No Products Found</p>

                </div>
            </div>
        )
    }


    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12 ">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                <div className="lg:col-span-4">
                    <div className="border rounded-md overflow-hidden bg-white">
                        {
                            data?.docs.map((product, index) => (
                                <CheckoutItem key={product.id} isLast={index === data.docs.length - 1} imageUrl={product.image?.url} name={product.name} productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`} tenantUrl={generateTenantURL(product.tenant.slug)} tenantName={product.tenant.name} price={product.price} onRemove={() => { removeAProduct(product.id) }} />
                            ))
                        }


                    </div>

                </div>

                <div className="lg:col-span-3">
                    <CheckoutSidebar totalPrice={data?.totalPrice} onCheckout={() => { }} isCancelled={false} isPending={false} />
                </div>

            </div>
        </div>
    )


}