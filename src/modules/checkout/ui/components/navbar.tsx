'use client'

import { Button } from "@/components/ui/button"
import { generateTenantURL } from "@/lib/utils"
// import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-button"

// import { Poppins } from "next/font/google"

import Link from "next/link"


interface Prop {
    slug: string
}

// const poppins = Poppins({
//     subsets: ["latin"],
//     weight: ["700"]
// })


export const Navbar = ({ slug }: Prop) => {
    // as the data is already prefetched when the navbar loads so we dont need to check is data is coming or not

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) flex mx-auto justify-between items-center h-full px-4 lg:px-12 ">
                <p className="text-xl">Checkout</p>
                <Button variant={"outline"} asChild>
                    <Link href={`${generateTenantURL(slug)}`}>
                        Continue Shopping
                    </Link>
                </Button>
            </div>

        </nav>
    )
}


