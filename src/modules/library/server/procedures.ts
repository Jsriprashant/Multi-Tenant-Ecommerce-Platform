import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from 'zod'
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";


export const libraryRouter = createTRPCRouter({

    getOne: protectedProcedure

        .input(z.object({
            productId: z.string()
        }))

        .query(async ({ ctx, input }) => {

            const ordersData = await ctx.db.find({
                collection: 'orders',
                depth: 0, // we want just ids without populating
                limit: 1,
                pagination: false,
                where: {
                    and: [
                        {
                            product: {
                                equals: input.productId
                            }

                        },
                        {
                            user: {
                                equals: ctx.session.user.id

                            }

                        }

                    ]


                }
            })

            const order = ordersData.docs[0]

            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found"
                })
            }


            const product = await ctx.db.findByID({
                collection: "products",

                id: input.productId


            })

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found "
                })
            }

            return {
                product
            }
        }),

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
            const dataWithSummarizedReviews = await Promise.all(
                // using promise.all enables us to use Async inside the map
                productsData.docs.map(async (doc) => {
                    const reviewData = await ctx.db.find({
                        collection: "reviews",
                        pagination: false,
                        where: {
                            product: {
                                equals: doc.id
                            }
                        }
                    })

                    return {
                        ...doc,
                        reviewCount: reviewData.totalDocs,
                        reviewRating: reviewData.docs.length === 0 ? 0 : reviewData.docs.reduce((acc, review) => acc + review.rating, 0) / reviewData.totalDocs
                    }

                })
            )


            return {
                ...productsData,
                docs: dataWithSummarizedReviews.map((doc) => ({
                    ...doc,
                    image: doc.image as Media,
                    // this tenant is automatically added as we are using the multiTenantPlugin
                    tenant: doc.tenant as Tenant & { image: Media | null }
                    //


                }))
            }
        })

})