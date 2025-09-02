
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantURL(tenantSlug: string) {

  const isDevelopment = process.env.NODE_ENV === "development"
  const isSubdomainRoutingEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true"


  // In development mode use normal routing
  // if (process.env.NODE_ENV === "development") {
  //   return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`

  // }
  // as the subdomain routing is not implemented now, so we are now just for testing allowing normal routing,
  // In development or in subdomain disabled routing developemt mode use normal routing
  if (isDevelopment || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`

  }


  // when in production we have to use 'https'
  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

  // when in production we have to use subdomain routing
  return `${protocol}://${tenantSlug}.${domain}`

}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-in", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,

  }).format(Number(value))
}

