import { isSuperAdmin } from '@/lib/access'
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


// })

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    // the user without super-admin role, should not even see the user box in the dashboard
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  access: {
    // only super admin has the ability to create, delete, update a new user
    // also the user who is accessing the dashboard can update details, no random user can
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true
      // we are only letting either superAdmin or the user who is accessing the dashboeard to update.Not any random user

      return req.user?.id === id
    }


  },
  // On logging out from dashboard, payload does not clear the cookies, as in payload's backend code we see that, it takes in the existing cookie and then expires it.
  // so we put the same seetings here also as we did in generate cookie 
  // auth: true, previous code
  auth: {
    cookies: {
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "None",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: true
      })
    }
  },

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
      options: ["user", "super-admin"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
        // only super admin can update the role
      }

    },
    {
      name: "tenants",
      type: "array",
      admin: {
        position: "sidebar",
      },
      access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        // only super admins would be able to create the tenant array.
        update: ({ req }) => isSuperAdmin(req.user),
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
            create: ({ req }) => isSuperAdmin(req.user),
            update: ({ req }) => isSuperAdmin(req.user),
          },
        },
      ],
    }


  ],
}
