"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCart } from "../../hooks/use-cart"
import { useEffect } from "react"
import { toast } from "sonner"
import { generateTenantURL } from "@/lib/utils"
import { CheckoutItem } from "../components/checkout-item"
import { CheckoutSidebar } from "../components/checkout-sidebar"
import { InboxIcon, LoaderIcon } from "lucide-react"
import { useCheckoutStates } from "../../hooks/use-checkout-states"
import { useRouter } from "next/navigation"

interface props {
    tenantSlug: string
}


export const CheckoutView = ({ tenantSlug }: props) => {

    const router = useRouter()

    const { productIds, removeAProduct, clearCart } = useCart(tenantSlug)
    // we are extracting data by destructuring, this is the proper way

    // but if we do  like this const cart = useCart(tenantSlug)
    //cart.addProduct() -->  somethig like this, then this gives error as the memoization does not work in this way

    const [states, setStates] = useCheckoutStates()

    const trpc = useTRPC()

    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery(trpc.checkout.getProducts.queryOptions(
        {
            ids: productIds,
        }
    ))

    // we are not using any prefetch suspence because the productIds are coming from local storage so no need to use prefectch, as prefetch is used only when.

    // now what if teh tenant deletes the product from store then, the product may still be in user's cart, which should not be allowed, so we clear the localStorage of the user

    const purchase = useMutation(trpc.checkout.purchase.mutationOptions({
        onMutate: () => {
            setStates({ success: false, cancel: false })
        },
        // on sucess does not mean user has purchased the product sucessfully, it only means that sucesss link has been generated
        onSuccess: (data) => { window.location.href = data.url },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                //TODO: modify when subdomains are enabled
                router.push("/sign-in")
            }
            toast.error(error.message)
        }
    }))

    useEffect(() => {
        if (states.success) {
            // setStates({ success: false, cancel: false })
            clearCart()
            // this is giveing error
            // Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

            // somehow this when this clear cart runs then this useEffect is going into infinite loop

            // if purchase is sucess we will clear the cart of the user
            //TODO:Invalidate Library

            queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter())

            router.push("/library")
            // we need to invalidate the query, so that if the userbuys a new product then it could refetched from the db

        }
    }, [states.success, clearCart, router, setStates, queryClient, trpc.library.getMany])


    useEffect(() => {
        if (error?.data?.code === 'NOT_FOUND') {
            clearCart()
            toast.warning("Invalid Products Found, Cart Cleared")
        }
    }, [error, clearCart])

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
                    <CheckoutSidebar totalPrice={data?.totalPrice} onPurchase={() => purchase.mutate({ tenantSlug, productIds })} isCancelled={states.cancel} disabled={purchase.isPending} />
                </div>

            </div>
        </div>
    )


}