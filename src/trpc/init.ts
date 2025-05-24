import { initTRPC } from '@trpc/server';
import { cache } from 'react';


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
    // transformer: superjson,
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