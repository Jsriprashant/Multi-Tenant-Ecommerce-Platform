import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from 'zod'


export const tagsRouter = createTRPCRouter({

    getMany: baseProcedure
    //procedure for fetching tags
        .input(z.object({
            cursor: z.number().default(1),
            // page number
            limit: z.number().default(DEFAULT_LIMIT)
            // tags per page is limiy
        }))

        .query(async ({ ctx, input }) => {

            const data = await ctx.db.find({
                // here pauload is renamed to db because we have added context of db to payload
                collection: 'tags',
                // just this simple we are achieveing pagination
                page: input.cursor,
                limit: input.limit

            })

            return data
        })

})