import { ReviewGetOneOutput } from "@/modules/reviews/types";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"


import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarPicker } from "@/components/star-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface props {
    productId: string,
    initialData?: ReviewGetOneOutput
}

const formSchema = z.object({
    rating: z.number().min(1, { message: "Rating is required" }).max(5),
    description: z.string().min(1, { message: "Description is required" }),
})

export const ReviewForm = ({ productId, initialData }: props) => {

    const [isPreview, setIsPreview] = useState(!!initialData) // this useState is to track if the review is new or we need to perform updates on the data.

    // so if the initialData is present then isPreview is set to true (!! converts initial data into boolean)
    //
    const trpc = useTRPC()
    const queryClint = useQueryClient()
    const createReview = useMutation(trpc.reviews.create.mutationOptions({
        onSuccess: () => {
            queryClint.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId
            }))
            setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    }))
    const updateReview = useMutation(trpc.reviews.update.mutationOptions({
        onSuccess: () => {
            queryClint.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId
            }))
            setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    }))



    const form = useForm<z.infer<typeof formSchema>>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                rating: initialData?.rating ?? 0,
                // before setting the default rating we are checking if the initial data has rating or not if then fallback to zero, same for description 
                description: initialData?.description ?? "",
            }

        }
    )

    const onSubmit = (values: z.infer<typeof formSchema>) => {

        if (initialData) {
            updateReview.mutate({
                reviewId: initialData.id,
                rating: values.rating,
                description: values.description

            })
        }
        else {
            createReview.mutate({
                productId,
                rating: values.rating,
                description: values.description

            })
        }
    }

    return (
        <div>
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <p className="font-medium">
                        {isPreview ? "Your Rating : " : "Liked it? Give it a rating?"}
                    </p>
                    <FormField control={form.control} name="rating" render={({ field }) => (

                        <FormItem >
                            <FormControl>
                                <StarPicker value={field.value} onChange={field.onChange} disabled={isPreview} />


                            </FormControl>
                            <FormMessage />
                        </FormItem >

                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (

                        <FormItem >
                            <FormControl>
                                <Textarea placeholder="Want to leave a written review?" disabled={isPreview} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem >

                    )} />
                    {
                        !isPreview && (
                            <Button variant={"elevated"} disabled={createReview.isPending || updateReview.isPending} type="submit" size={"lg"} className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit">
                                {
                                    initialData ? "Update Review" : "Post Review"
                                }
                            </Button>
                        )
                    }

                </form>

                {
                    isPreview && (
                        <Button onClick={() => setIsPreview(false)} size={"lg"} type="button" variant={"elevated"} className="w-fit mt-4">
                            Edit
                        </Button>
                    )
                }
            </Form>
        </div>
    )
}

export const ReviewFormSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-medium">
                Liked it? Give it a rating?
            </p>
            <StarPicker disabled />

            <Textarea placeholder="Want to leave a written review?" disabled />

            <Button variant={"elevated"} disabled type="submit" size={"lg"} className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit">

            </Button>

        </div >
    )
}