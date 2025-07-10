import type { Stripe } from "stripe"

import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config"
import { ExpandedLineItems } from "@/modules/checkout/types";

export async function POST(req: Request) {

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get("stripe-signature") as string,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
        // the request trying to enter into this endpoint must have all the 3 things, i.e it must have header named stripe-signature, then with the header content under stripe-signature, the stripe server's secret will be matched and then only req will be allowed to get in in this endpoint 
    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "Unknown Error"

        if (error! instanceof Error) {
            console.log(error)
        }

        console.log(`❌Error Message: ${errorMessage}`)
        return NextResponse.json(
            { message: `Webhook Error:${errorMessage}` },
            { status: 400 }
        )
    }


    console.log(`✅Success:${event.id}`)

    const permittedEvents: string[] = [
        "checkout.session.completed"
    ]

    const payload = await getPayload({ config })

    if (permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) {
                case "checkout.session.completed":

                    // this data is the cutomer who is buying the product, its his data
                    data = event.data.object as Stripe.Checkout.Session

                    if (!data.metadata?.userId) {
                        throw new Error("User ID is required")
                    }

                    const user = await payload.findByID({
                        collection: "users",
                        id: data.metadata?.userId
                    })

                    if (!user) {
                        throw new Error("User not found")
                    }

                    // finding the id of the product that the user has purchased

                    const expandedSession = await stripe.checkout.sessions.retrieve(
                        data.id,
                        {
                            expand: ["line_items.data.price.product"],
                        }
                    )

                    if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
                        throw new Error("No line items found")
                        // could'nt load what you have purchased
                    }
                    const lineItems = expandedSession.line_items.data as ExpandedLineItems[]

                    // creating order for each product

                    for (const item of lineItems) {
                        await payload.create({
                            collection: "orders",
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id, // customer who buyed
                                product: item.price.product.metadata.id,
                                name: item.price.product.name

                            },
                        })
                    }

                    break;
                default:
                    throw new Error(`Unhandled event: ${event.type}`)

            }
        } catch (error) {
            console.log(error)

            return NextResponse.json(
                {
                    message: "Webhook handler failed"
                },
                {
                    status: 500
                },

            )

        }
    }

    // always return something to webhook as the webhook needs to know if the event was sucessfull
    return NextResponse.json(
        {
            message: "Received"
        },
        {
            status: 200
        },

    )


} 