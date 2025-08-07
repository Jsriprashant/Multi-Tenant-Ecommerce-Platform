import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from 'zod'
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/constants";


export const checkoutRouter = createTRPCRouter({

    // now we need to have a protected procedure, so that only logged in users can acess this 
    // so we are going to create a new protected procedeure in src\trpc\init.ts

    // this base procedure can be accessed by user even if he is not loggged in

    verify: protectedProcedure.mutation(async ({ ctx }) => {

        const user = await ctx.db.findByID({
            collection: "users",
            id: ctx.session.user.id,
            depth: 0,
        })

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User could not be found"
            })
        }

        const tenantId = user.tenants?.[0]?.tenant as string // This will be ID as the depth is 0, so the tenants will not be populated. only we will get the ids.

        const tenant = await ctx.db.findByID({
            collection: "tenants",
            id: tenantId
        })

        if (!tenant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Tenant not found"
            })
        }

        const accountLink = await stripe.accountLinks.create({
            account: tenant.stripeAccountId,
            refresh_url: `${process.env.NEXT_APP_URL!}/admin`,
            return_url: `${process.env.NEXT_APP_URL!}/admin`,
            type: "account_onboarding",
        })

        if (!accountLink.url) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create verification link"
            })
        }


        return { url: accountLink.url }


    }),


    purchase: protectedProcedure.input(z.object({
        productIds: z.array(z.string()).min(1),
        // ensuring atleast min 1 product is passed
        tenantSlug: z.string().min(1)
    }))
        .mutation(async ({ ctx, input }) => {
            const products = await ctx.db.find({
                collection: "products",
                depth: 2,
                where: {
                    and: [
                        // checking if the product is truly inside the product and also if it is present inside of that tenant
                        // so that if the user adds something in the local storage explicitly then the product check will fail here
                        // 1st and condition
                        {
                            id: {
                                in: input.productIds
                            }
                        },
                        // 2nd and condition
                        {
                            "tenant.slug": {
                                equals: input.tenantSlug
                            }
                        }
                    ]
                }
            })

            if (products.totalDocs !== input.productIds.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" })
            }

            const tenantData = await ctx.db.find({
                collection: "tenants",
                limit: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.tenantSlug
                    }
                }
            })

            const tenant = tenantData.docs[0]

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant Not Found"
                })
            }
            if (!tenant.stripeDetailsSubmitted) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Tenant not allowd to sell products"
                })
            }

            // TODO: Throw Error if stripe details not submitted

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
                quantity: 1,
                price_data: {
                    unit_amount: product.price * 100, /* multiplied by 100 because default unit is in cents in stripe  */
                    currency: "USD",
                    product_data: {
                        name: product.name,
                        metadata: {
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price,

                        } as ProductMetadata
                    }
                }
            }))

            const totalAmount = products.docs.reduce((acc, item) => acc + item.price * 100, 0)

            const platformFeeAmount = Math.round(
                totalAmount * (PLATFORM_FEE_PERCENT / 100)
            )

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user?.email,
                success_url: `${process.env.NEXT_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                cancel_url: `${process.env.NEXT_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
                mode: "payment",
                line_items: lineItems,
                invoice_creation: {
                    enabled: true,
                },
                metadata: {
                    // this is the meta data of the currently logged in customer/user who has buyed the product
                    userId: ctx.session.user?.id
                } as CheckoutMetadata,
                payment_intent_data: {
                    application_fee_amount: platformFeeAmount
                }

            }, {
                stripeAccount: tenant.stripeAccountId
            })

            if (!checkout.url) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create checkout session" })
            }

            return { url: checkout.url }


        })
    ,

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