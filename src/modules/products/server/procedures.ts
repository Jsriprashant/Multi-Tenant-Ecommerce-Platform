import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from 'zod'
import type { Sort, Where } from 'payload'
import { Category } from "@/payload-types";

import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({

    getMany: baseProcedure

        .input(z.object({
            category: z.string().nullable().optional(),
            minPrice: z.string().nullable().optional(),
            maxPrice: z.string().nullable().optional(),
            tags: z.array(z.string()).nullable().optional(),
            sort: z.enum(sortValues).nullable().optional(),

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
                depth: 1, // populate the image and the categories
                sort: sort, // sort by name in ascending order
                where: where,


            })

            return data
        })

})