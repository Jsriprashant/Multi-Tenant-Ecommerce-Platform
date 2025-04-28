import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
    slug: 'categories',

    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        // Email added by default
        // Add more fields as needed
    ],
}
// once we create a new collection, we need to import it and add it to the payload.config.ts file in the collections array
// if still new collection is not showing up then we can run "payload:generate:types" command to generate the types again
