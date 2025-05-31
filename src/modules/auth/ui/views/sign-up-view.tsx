'use client'

import React from 'react'

import { useForm } from "react-hook-form"
import z from 'zod'
import Link from 'next/link'
import { registerSchema } from '../../schemas'
import { Poppins } from "next/font/google"
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const SignUpView = () => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => { toast.error(error.message) },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/")
        }
        // why we need a funciton for this?
    }))

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            username: ''
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

    // to actively observe username we use form.watch
    const username = form.watch('username')
    // actively watches the errors
    const usernameErrors = form.formState.errors.username

    // has username only when usernameerors sre not present
    const showPreview = username && !usernameErrors

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
                                <Link href={"/sign-in"}>
                                    Sign in
                                </Link>
                            </Button>

                        </div>
                        <h1 className='text-4xl font-medium'>
                            Join over 2,047 creators earning money on funroad
                        </h1>
                        <FormField name='username' render={({ field }) => (
                            <FormItem>

                                <FormLabel className='text-base'>
                                    Username
                                </FormLabel>

                                <FormControl>
                                    <Input {...field} />
                                    {/* now the field has attributes like onchange onblur etc, so instead of manually adding them one by one we are destrctuing it to add them all at once  */}

                                </FormControl>
                                <FormDescription className={cn("hidden", showPreview && "block")}>
                                    Your store will be available at {" "}
                                    <strong>{username}</strong>.shop.com
                                </FormDescription>
                                <FormMessage />
                            </FormItem>

                        )} />
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

                        <Button type='submit' size={"lg"} variant={"elevated"} className='bg-black text-white hover:bg-pink-400 hover:text-primary' disabled={register.isPending}>
                            Create Account
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
