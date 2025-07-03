import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import { headers as getHeaders } from 'next/headers';


import configPromise from '@payload-config'
import { getPayload } from 'payload'


export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
    const payload = await getPayload({
        config: configPromise,
    })
    return next({ ctx: { db: payload } })

    // Here, every procedure using baseProcedure gets a ctx object with a db property (your Payload CMS instance).
    // You can add authentication logic in your context or middleware.
    // For example, you could check a JWT token and add user to ctx
});

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const headers = await getHeaders()
    const session = await ctx.db.auth({ headers })
    console.log(session)

    if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Please Login first" })
    }

    return next({
        ctx: {
            ...ctx,
            session: {
                ...session,
                user: session.user,
            },
        }
    })

})