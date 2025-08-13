
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantURL(tenantSlug: string) {


  // In development mode use normal routing
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`

  }

  // when in production we have to use 'https'
  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

  // when in production we have to use subdomain routing
  return `${protocol}://${tenantSlug}.${domain}`

}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,

  }).format(Number(value))
}

