import type { CollectionConfig } from 'payload'

//This categoreies collection will be used to store the categories in the front end
export const Reviews: CollectionConfig = {
    slug: 'reviews',
    // admin: {
    //     useAsTitle: "description"
    // },

    fields: [
        {
            name: "description",
            type: "textarea",
            required: true,
        },
        {
            name: "rating",
            required: true,
            type: "number",
            min: 1,
            max: 5
        },
        {
            name: "product",
            type: "relationship",
            relationTo: "products",
            hasMany: false,
            required: true
            // now each categories can have subcategories
            //so we create this field, suppose business is a category and it has subcategories like "business1", "business2" etc
            // so we can select business as parent and then select business1, business2 as subcategories
            //so if a categorie does not have a parent then it is a main category
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            hasMany: false,
            required: true
        },





        // Email added by default
        // Add more fields as needed
    ],
}
// once we create a new collection, we need to import it and add it to the payload.config.ts file in the collections array
// if still new collection is not showing up then we can run "payload:generate:types" command to generate the types again
