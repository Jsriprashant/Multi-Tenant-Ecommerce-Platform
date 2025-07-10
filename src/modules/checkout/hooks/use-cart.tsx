import { useCartStore } from "../store/use-cart-store";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow"

export const useCart = (tenantSlug: string) => {

    //   const { getCartByTenant, addAProduct, removeAProduct, clearCart, clearAllcarts } = useCartStore()

    // const getCartByTenant = useCartStore((state) => state.getCartByTenant)
    const addAProduct = useCartStore((state) => state.addAProduct)
    const removeAProduct = useCartStore((state) => state.removeAProduct)
    const clearCart = useCartStore((state) => state.clearCart)
    const clearAllcarts = useCartStore((state) => state.clearAllcarts)

    const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []))

    // we are meoizing every function

    const toggleProduct = useCallback(
        (productId: string) => {
            if (productIds.includes(productId)) {
                removeAProduct(tenantSlug, productId)
            } else {
                addAProduct(tenantSlug, productId)
            }
        },

        [addAProduct, removeAProduct, productIds, tenantSlug],
    )
    // toggle product will only call reRender if one of the items in dependency array will change 

    // now addAProduct, removeAProduct, tenantSlug are straight from the selectors
    // this productId is a array, so no two arrays are same, suppose [1,2]===[1,2] will be false then the usecall back will re render toggle product again and aagain
    // for this we use useshallow from zustand.



    // const toggleProduct = (productId: string) => {
    //     if (productIds.includes(productId)) {
    //         removeAProduct(tenantSlug, productId)
    //     } else {
    //         addAProduct(tenantSlug, productId)
    //     }
    // }

    const isProductInCart = useCallback(
        (productId: string) => {
            return productIds.includes(productId)
        }, [productIds]
    )

    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug)
    }, [tenantSlug, clearCart]
    )


    const handleAddProduct = useCallback((productId: string) => {
        addAProduct(tenantSlug, productId)
    }, [addAProduct, tenantSlug]
    )

    const handleRemoveProduct = useCallback((productId: string) => {
        removeAProduct(tenantSlug, productId)
    }, [removeAProduct, tenantSlug]
    )

    return {
        productIds,
        addAProduct: handleAddProduct,
        removeAProduct: handleRemoveProduct,
        clearCart: clearTenantCart,
        clearAllcarts,
        toggleProduct,
        isProductInCart,
        totalItems: productIds.length,
    };
}

