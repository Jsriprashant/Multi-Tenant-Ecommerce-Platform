import { isSuperAdmin } from '@/lib/access'
import { Tenant } from '@/payload-types'
import type { CollectionConfig } from 'payload'


export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: ({ req }) => {
            if (isSuperAdmin(req.user)) return true

            const tenant = req.user?.tenants?.[0]?.tenant as Tenant
            // as the default depth is 2 so the tenant will be populated in the user data

            // only let tenant create product if their stripe account details are submitted
            return Boolean(tenant?.stripeDetailsSubmitted)

        },
        // only super admins would be able to create the tenant array.

        delete: ({ req }) => isSuperAdmin(req.user)

    },
    admin: {
        useAsTitle: "name",
        description: "You must verify your account before creating products."
    },
    fields: [

        {
            name: "name",
            type: "text",
            required: true

        },
        {
            name: "description",
            // change to rich text
            type: "richText",
        },
        {
            name: "price",
            type: "number",
            required: true,
            admin: {
                description: "The minimum price of the product must be greater than ₹50."
            }

        },
        // now every single product will have a category, so we need a relation of each product to one of the categories
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false // makes sure that one product belongs to only one category

        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true // makes sure that one product belongs to only one category

        },

        {
            // payload also takes care of image uploads to mongoDb and uptill now i guess no multer is required
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
            defaultValue: "30-day"
        },
        {
            name: "content",
            // change to richText
            type: "richText",
            admin: {
                description: "Protected content only visible to customers after purchase. Add product documentation and downloadable files, getting started guides, and bonus materials. Supports markdown formatting."
            }
        },
        {
            name: 'isPrivate',
            label: "Private",
            defaultValue: false,
            //default value was "null" or "undefined" if we did not specify it.

            type: "checkbox",
            admin: {
                description: "Check if you dont want to store this product in the Storefront. "
            }
        },
        {
            name: 'isArchived',
            label: "Archive",
            defaultValue: false,
            //default value was "null" or "undefined" if we did not specify it.

            type: "checkbox",
            admin: {
                description: "Check if you want archive this product "
            }
        }


    ]
}