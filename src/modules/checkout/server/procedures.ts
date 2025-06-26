import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from 'zod'
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";


export const checkoutRouter = createTRPCRouter({

    getProducts: baseProcedure

        .input(z.object({
            ids: z.array(z.string())

        }))

        .query(async ({ ctx, input }) => {

            const data = await ctx.db.find({

                collection: 'products',
                depth: 2, // populate the image and the categories, and after adding multi tenant pulgin it populates tenant also depth 1 will load uptill here
                //depth 2 will load the tenamt.image
                where: {
                    id: {
                        in: input.ids
                    }
                },
            })

            // what if something hapenned with the local storage and all the products are not loaded, below is the check for that

            if (data.totalDocs !== input.ids.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products Not found" })
            }
            // we will catch this above defined not found error in a use effect and clear the local storage

            const totalPrice = data.docs.reduce((acc, product) => {
                const price = Number(product.price);
                return acc + (isNaN(price) ? 0 : price)
            }, 0)

            return {
                ...data,
                totalPrice: totalPrice,
                // used reduce to get the total price of the cart
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media,

                    // this tenant is automatically added as we are using the multiTenantPlugin
                    tenant: doc.tenant as Tenant & { image: Media | null }
                    //


                }))
            }
        })

})