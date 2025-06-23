'use client'

import { cn, generateTenantURL } from "@/lib/utils"
// import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-button"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Poppins } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ShoppingCartIcon } from "lucide-react"

interface Prop {
    slug: string
}

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

const CheckoutButton = dynamic(
    () => import("@/modules/checkout/ui/components/checkout-button").then((mod) => mod.CheckoutButton,),
    {
        ssr: false,
        loading: () => <Button className="bg-white" disabled><ShoppingCartIcon className="text-black" /></Button>
    }
);


export const Navbar = ({ slug }: Prop) => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({
        slug,
    }))
    // as the data is already prefetched when the navbar loads so we dont need to check is data is coming or not

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) flex mx-auto justify-between items-center h-full px-4 lg:px-12 ">
                <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
                    {
                        data.image?.url && (
                            <Image src={data.image.url} width={32} height={32} className="rounded-full border shrink-0 size-[32px]" alt={slug} />
                        )
                    }
                    <p className={cn("text-xl", poppins.className)}>{data.name}</p>
                </Link>

                <CheckoutButton tenantSlug={slug} hideIfEmpty />
            </div>

        </nav>
    )
}

export const NavbarSkeleton = () => {

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) flex mx-auto justify-between items-center h-full px-4 lg:px-12 ">
                {/* TODO: Skeleton for Checkout Button  */}
                <Button className="bg-white" disabled>
                    <ShoppingCartIcon className="text-black" />
                </Button>
            </div>

        </nav>
    )

}


