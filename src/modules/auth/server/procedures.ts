
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";

import { loginSchema, registerSchema } from "../schemas";
import { generateCookies } from "../utils";

// import configPromise from '@payload-config'
// import { getPayload } from 'payload'


export const authRouter = createTRPCRouter({

    session: baseProcedure.query(async ({ ctx }) => {

        const headers = await getHeaders();
        const session = await ctx.db.auth({ headers })
        // now this ctx is comming from baseprocedure and db is the payload (see init.ts file src\trpc\init.ts)
        // payload has the auth functionality

        return session


    }),

    register: baseProcedure.input(
        registerSchema // this is defined in src\modules\auth\schemas.ts for simplicity
    ).mutation(async ({ input, ctx }) => {

        const foundUsername = await ctx.db.find({
            collection: "users",
            limit: 1,
            where: {
                username: {
                    equals: input.username
                }
            }
        })

        const existingData = foundUsername.docs[0];
        if (existingData) {

            throw new TRPCError({ code: "BAD_REQUEST", message: "Username already taken" })
        }

        const tenant = await ctx.db.create({
            collection: "tenants",
            data: {
                name: input.username,
                slug: input.username,
                stripeAccountId: "test",

            }
        })
        // we have created a tenant from above, now we plug this tenant to the user collection

        await ctx.db.create({
            collection: "users",
            data: {
                email: input.email,
                username: input.username,
                password: input.password,
                // password is automatically hashed in payload
                tenants:
                    [
                        { tenant: tenant.id }
                    ]


            }

        })


        // ensures that user automatically gets logged in after registration, copied the below codes from login procedure
        const data = await ctx.db.login({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
                // password is automatically hashed in payload
            }

        })
        if (!data.token) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Failed To Login"
            })

        }

        // const cookies = await getCookies();
        // cookies.set({
        //     name: AUTH_COOKIE,
        //     value: data.token,
        //     httpOnly: true,
        //     path: "/"
        //     // todo: ensure cross domain cookie sharing.
        //     // so innitial cookie will be generated when we login to funroad.com
        //     // but if we travel to jp.funroad.com then cookie is not present here and it will be lost 
        //     // so we need to enable the cross domain cookie sharing

        // })
        await generateCookies({
            prefix: ctx.db.config.cookiePrefix,
            value: data.token
        })

        return data
    }),


    login: baseProcedure.input(
        loginSchema

    ).mutation(async ({ input, ctx }) => {
        const data = await ctx.db.login({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
                // password is automatically hashed in payload
            }

        })
        if (!data.token) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Failed To Login"
            })

        }


        // http://localhost:3000/api/users/login
        // now we will set the cookie by visiting this api

        // const cookies = await getCookies();
        // cookies.set({
        //     name: AUTH_COOKIE,
        //     value: data.token,
        //     httpOnly: true,
        //     path: "/"
        //     // todo: ensure cross domain cookie sharing.
        //     // so innitial cookie will be generated when we login to funroad.com
        //     // but if we travel to jp.funroad.com then cookie is not present here and it will be lost 
        //     // so we need to enable the cross domain cookie sharing

        // })

        await generateCookies({
            prefix: ctx.db.config.cookiePrefix,
            value: data.token
        })

        return data

    }),

    // logout: baseProcedure.mutation(async () => {
    //     const cookies = await getCookies()
    //     cookies.delete(AUTH_COOKIE)
    // })

})