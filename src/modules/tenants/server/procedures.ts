
import { Tenant, Media } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from 'zod'


export const tenantsRouter = createTRPCRouter({

    getOne: baseProcedure
        //procedure for fetching tags
        .input(z.object({
            slug: z.string()
        }))

        .query(async ({ ctx, input }) => {

            const tenantsData = await ctx.db.find({
                // here pauload is renamed to db because we have added context of db to payload
                collection: 'tenants',
                // just this simple we are achieveing pagination
                depth: 1,
                where: {
                    slug: {
                        equals: input.slug
                    }
                },
                limit: 1,
                pagination: false

            })
            const tenant = tenantsData.docs[0];
            if (!tenant) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" })
            }

            return tenant as Tenant & { image: Media | null }
            // why we have to do this kind of return its because  payload's local api does not change typescript depending on the depth 
        })

})