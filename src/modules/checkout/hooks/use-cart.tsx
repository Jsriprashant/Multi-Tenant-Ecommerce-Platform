import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
    const { getCartByTenant, addAProduct, removeAProduct, clearCart, clearAllcarts } = useCartStore()

    const productIds = getCartByTenant(tenantSlug)

    const toggleProduct = (productId: string) => {
        if (productIds.includes(productId)) {
            removeAProduct(tenantSlug, productId)
        } else {
            addAProduct(tenantSlug, productId)
        }
    }

    const isProductInCart = (productId: string) => {
        return productIds.includes(productId)
    }

    const clearTenantCart = () => {
        clearCart(tenantSlug)
    }

    return {
        productIds,
        addAProduct: (productId: string) => addAProduct(tenantSlug, productId),
        removeAProduct: (productId: string) => removeAProduct(tenantSlug, productId),
        clearCart: clearTenantCart,
        clearAllcarts,
        toggleProduct,
        isProductInCart,
        totalItems: productIds.length,
    };
}   

