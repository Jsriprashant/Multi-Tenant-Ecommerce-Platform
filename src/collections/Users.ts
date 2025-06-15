import type { CollectionConfig } from 'payload'
// import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant"



// const defaultTenantField = tenantsArrayField({
//   tenantsArrayFieldName: "tenants",
//   tenantsCollectionSlug: "tenants",
//   tenantsArrayTenantFieldName: "tenant",
//   arrayFieldAccess: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//   },
//   tenantFieldAccess: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//   },


//   })

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    {
      admin: {
        position: "sidebar"
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["user", "super-admin"]

    },
    {
      name: "tenants",
      type: "array",
      admin: {
        position: "sidebar",
      },
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
      fields: [
        {
          name: "tenant",
          type: "relationship",
          relationTo: "tenants",
          admin: {
            position: "sidebar"
          },
          required: true,
          access: {
            read: () => true,
            create: () => true,
            update: () => true,
          },
        },
      ],
    }


  ],
}
