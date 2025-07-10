import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"


interface TenantCart {
    // this stores the productIds which a tenent will add in their cart
    productIds: string[],
}

// for each tenant we are going to a different cart
interface CartState {
    tenantCarts: Record<string, TenantCart>
    // Record means tenantCart id of type object and 

    // every user has the options to
    addAProduct: (tenantSlug: string, productId: string) => void;
    removeAProduct: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void,
    clearAllcarts: () => void,
// removed getCartbytenant
}

export const useCartStore = create<CartState>()(
    // why a extra () was required here?
    persist(
        (set) => ({
            tenantCarts: {}, // initially tenantCart is empty
            addAProduct: (tenantSlug, productId) => set((state) => ({
                tenantCarts: {
                    ...state.tenantCarts,
                    [tenantSlug]: {
                        productIds: [
                            ...(state.tenantCarts[tenantSlug]?.productIds || []),
                            productId,
                        ]
                    }
                }
            })),
            removeAProduct: (tenantSlug, productId) => set((state) => ({
                tenantCarts: {
                    ...state.tenantCarts,
                    [tenantSlug]: {
                        productIds: state.tenantCarts[tenantSlug]?.productIds.filter((id) => id !== productId
                        ) || []
                    }
                }
            })),
            clearCart: (tenantSlug) => set((state) => ({
                tenantCarts: {
                    ...state.tenantCarts,
                    [tenantSlug]: {
                        productIds: []
                    }
                }
            })),
            clearAllcarts: () => set(
                { tenantCarts: {}, }
            ),

        }),
        {
            name: "funroad-cart",
            storage: createJSONStorage(() => localStorage)
            // locastorage comes from window.localStorage, so we can use it directly
        },
    )
)



