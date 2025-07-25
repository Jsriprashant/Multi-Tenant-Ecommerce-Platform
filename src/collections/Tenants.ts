import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'slug',
        // this is the setting for admin dashboard,
    },
    fields: [
        // Email added by default
        // Add more fields as needed
        {
            name: "name",
            required: true,
            type: "text",
            admin: {
                description: "This is the name of the store e.g. Jp's Store"
            }
            // here admin means the person looking at the dashboard, or the user who has signed in 
        },
        {
            // this is the subdomain field, which the user's subdomain
            name: "slug",
            required: true,
            type: "text",
            index: true,
            unique: true,
            admin: {
                description: "This is the subdomain of the store e.g. Jp.funroad.com"
            }

        },
        {// store's image
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            // this field stores the accoint Id of teh user, which ensures that the user who ownes this store has verified their details with stripe

            name: "stripeAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true
            }

        },
        {
            // this field stores the accoint Id of teh user, which ensures that the user who ownes this store has verified their details with stripe

            name: "stripeDetailsSubmitted",
            type: "checkbox",
            // required: true,
            admin: {
                readOnly: true,
                description: " You cannot create products until you submit your Stripe details"
            }

        }

    ],
}
