import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from 'zod'
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";


export const libraryRouter = createTRPCRouter({
    getMany: protectedProcedure

        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT),
        }))

        .query(async ({ ctx, input }) => {
            // const where: Where = {}
            // fethcing all ordrers that the signed in user has created.
            const ordersData = await ctx.db.find({
                // here pauload is renamed to db because we have added context of db to payload
                collection: 'orders',
                depth: 0, // we want just ids without populating

                limit: input.limit,
                page: input.cursor,
                where: {
                    user: {
                        equals: ctx.session.user.id
                    }
                }
            })

            const productIds = ordersData.docs.map((order) => order.product)
            // as the depth is 0 we will get the id only

            const productsData = await ctx.db.find({
                collection: "products",
                pagination: false,
                where: {
                    id: {
                        in: productIds
                    }
                }
            })

            return {
                ...productsData,
                docs: productsData.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media,
                    // this tenant is automatically added as we are using the multiTenantPlugin
                    tenant: doc.tenant as Tenant & { image: Media | null }
                    //


                }))
            }
        })

})