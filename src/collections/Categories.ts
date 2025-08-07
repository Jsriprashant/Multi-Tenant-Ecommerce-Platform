import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

//This categoreies collection will be used to store the categories in the front end
export const Categories: CollectionConfig = {
    slug: 'categories',
    access: {
        read: ({ req }) => Boolean(req.user),
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user)
    },
    admin: {
        useAsTitle: "name"
    },

    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            required: true,
            type: "text",
            unique: true,
            index: true,
        },
        {
            name: "color",
            type: "text",

        },
        {
            name: "parent",
            type: "relationship",
            relationTo: "categories",
            hasMany: false
            // now each categories can have subcategories
            //so we create this field, suppose business is a category and it has subcategories like "business1", "business2" etc
            // so we can select business as parent and then select business1, business2 as subcategories
            //so if a categorie does not have a parent then it is a main category
        },
        {
            name: "subcategories",
            type: "join",
            collection: "categories",
            on: "parent",
            hasMany: true
        },





        // Email added by default
        // Add more fields as needed
    ],
}
// once we create a new collection, we need to import it and add it to the payload.config.ts file in the collections array
// if still new collection is not showing up then we can run "payload:generate:types" command to generate the types again
