import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  access: {
    read: () => true,
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
