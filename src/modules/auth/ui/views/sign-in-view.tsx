'use client'

import React from 'react'

import { useForm } from "react-hook-form"
import z from 'zod'
import Link from 'next/link'
import { loginSchema } from '../../schemas'
import { Poppins } from "next/font/google"
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const SignInView = () => {

    const router = useRouter();
    const trpc = useTRPC()

    const queryClient = useQueryClient();

    const login = useMutation(trpc.auth.login.mutationOptions({
        onError: (error) => { toast.error(error.message) },
        onSuccess: async () => {

            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/")
        }
        // result onError or OnSucess is sent back to the frontend from the server
        // why we need a funciton for this?

        // now what may happen is after cookies are generated and session is made, then also in page.tsx it might show null and after refreshing the page it loads the session, to prevent this we have to invalidate the session that is why we use invalidatequeries 
    }))
    //console.log thhis login and see what it outputs

    // with useMutation we can directly do this

    // const login = useMutation({
    //     // instead of using trpc funciton we have created our own funciton
    //     mutationFn: async (values: z.infer<typeof loginSchema>) => {
    //         const response = await fetch("api/users/login", {
    //             method: "POST",
    //             headers: {
    //                 "content-type": "application/json"
    //             },
    //             body: JSON.stringify(values)
    //         })

    //         if (!response.ok) {
    //             const error = await response.json()
    //             throw new Error(error.message || "Login Failed");

    //         }

    //         return response.json()
    //     },
    //     onError: (error) => { toast.error(error.message) },
    //     onSuccess: () => { router.push("/") }
    //     // result onError or OnSucess is sent back to the frontend from the server
    //     // why we need a funciton for this?
    // })



    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values)
    }


    return (
        <div className='grid grid-cols-1 lg:grid-cols-5'>
            <div className='bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col p-4 lg:p-16 gap-8'>
                        <div className='flex items-center justify-between mb-8'>
                            <Link href={"/"}>
                                <span className={cn("text-2xl font-semibold", poppins.className)}>
                                    funroad
                                </span>

                            </Link>

                            <Button asChild variant={"ghost"} size={"sm"} className='text-base border-none underline' >
                                <Link href={"/sign-up"}>
                                    Sign Up
                                </Link>
                            </Button>

                        </div>
                        <h1 className='text-4xl font-medium'>
                            Join over 2,047 creators earning money on funroad
                        </h1>
                        <FormField name='email' render={({ field }) => (
                            <FormItem>

                                <FormLabel className='text-base'>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                    {/* now the field has attributes like onchange onblur etc, so instead of manually adding them one by one we are destrctuing it to add them all at once  */}

                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )} />
                        <FormField name='password' render={({ field }) => (
                            <FormItem>

                                <FormLabel className='text-base'>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' />
                                    {/* now the field has attributes like onchange onblur etc, so instead of manually adding them one by one we are destrctuing it to add them all at once  */}

                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )} />

                        <Button type='submit' size={"lg"} variant={"elevated"} className='bg-black text-white hover:bg-pink-400 hover:text-primary' disabled={login.isPending}>
                            Log in
                        </Button>

                    </form>


                </Form>

            </div>

            <div className='h-screen w-full lg:col-span-2 hidden lg:block' style={{
                backgroundImage: "url(/auth-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>


            </div>
        </div>
    )
}
