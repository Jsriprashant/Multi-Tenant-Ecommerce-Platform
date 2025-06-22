import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from 'zod'
import type { Sort, Where } from 'payload'
import { Category, Media, Tenant } from "@/payload-types";

import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({

    getOne: baseProcedure
        .input(z.object({
            id: z.string()
        }))

        .query(async ({ ctx, input }) => {

            if (!input) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Please Provide teh correct Id" });
            }
            // const data = await ctx.db.find({

            //     collection: 'products',
            //     depth: 2, 
            //     where: {
            //         id: {
            //             equals: input.id
            //         }
            //     },
            //     limit: 1,

            // })
            const product = await ctx.db.findByID({
                collection: "products",
                id: input.id,
                depth: 2,
            })

            // return product

            // const productData = data.docs[0]

            return {
                ...product,
                image: product.image as Media | null,
                tenant: product.tenant as Tenant & { image: Media | null }

            }

        })
    ,
    getMany: baseProcedure

        .input(z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT),
            category: z.string().nullable().optional(),
            minPrice: z.string().nullable().optional(),
            maxPrice: z.string().nullable().optional(),
            tags: z.array(z.string()).nullable().optional(),
            sort: z.enum(sortValues).nullable().optional(),
            tenantSlug: z.string().nullable().optional()

        }))

        .query(async ({ ctx, input }) => {
            const where: Where = {}

            let sort: Sort = "-createdAt"

            if (input.sort === 'trending') {
                sort = "-createdAt"
            } else if (input.sort === 'curated') {
                sort = "-name"
            }
            else {
                sort = "-updatedAt"
            }

            if (input.minPrice && input.maxPrice) {
                where.price = {
                    greater_than_equal: input.minPrice,
                    less_than_equal: input.maxPrice
                }
                // these are price filters

            } else if (input.minPrice) {
                where.price = {
                    greater_than_equal: input.minPrice,
                }
            }
            else if (input.maxPrice) {
                where.price = {
                    less_than_equal: input.maxPrice,
                }

            }

            if (input.tags && input.tags.length > 0) {
                where["tags.name"] = {
                    in: input.tags
                }

            }
            if (input.tenantSlug) {
                where["tenant.slug"] = {
                    equals: input.tenantSlug
                }
            }

            if (input.category) {
                const categoriesData = await ctx.db.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    where: {
                        slug: {
                            equals: input.category
                        }
                    }
                })
                // now if we dont extract the data first and send the category direclty then if the input is parent category we will get category and suncategory data both, and if the input is subcategory then we will get only the subcategory
                // we want to display both category and subcategory 

                const formattedData = categoriesData.docs.map((doc) => ({
                    ...doc,
                    subcategories: (doc.subcategories?.docs ?? []).map((subdoc) => ({
                        //by provideing depth 1 the pyload dows not know that the subdoc is of type category or not
                        // and because of depth 1 we are confident that subdoc will have a type of category
                        //so we add a type to the subdoc, which is Category

                        ...(subdoc as Category)
                    }))
                }))

                const subcategoriesSlugs = []

                const parentCategory = formattedData[0]


                if (parentCategory) {
                    subcategoriesSlugs.push(...parentCategory.subcategories.map((subcategory) => subcategory.slug))

                    where["category.slug"] = {
                        in: [parentCategory.slug, ...subcategoriesSlugs]
                    }
                }

            }


            const data = await ctx.db.find({
                // here pauload is renamed to db because we have added context of db to payload
                collection: 'products',
                depth: 2, // populate the image and the categories, and after adding multi tenant pulgin it populates tenant also depth 1 will load uptill here
                //depth 2 will load the tenamt.image
                sort: sort, // sort by name in ascending order
                where: where,
                limit: input.limit,
                page: input.cursor,



            })

            return {
                ...data,
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