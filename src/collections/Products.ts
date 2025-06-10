import type { CollectionConfig } from 'payload'


export const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "name"
    },
    fields: [

        {
            name: "name",
            type: "text",
            required: true

        },
        {
            name: "description",
            type: "text",
        },
        {
            name: "price",
            type: "number",
            required: true

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
        }


    ]
}