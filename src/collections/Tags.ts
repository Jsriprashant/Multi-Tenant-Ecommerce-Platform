import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
    slug: 'tags',
    access: {
        read: ({ req }) => isSuperAdmin(req.user),
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user)
    },
    admin: {
        useAsTitle: "name"
    },

    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            unique: true
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            hasMany: true
        }
    ],
}
