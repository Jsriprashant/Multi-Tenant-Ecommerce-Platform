'use client'

import { Poppins } from "next/font/google"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

interface navbarItemProps {
    href: string,
    children: React.ReactNode,
    isactive?: boolean
}

const NavbarItems = ({ href, children, isactive }: navbarItemProps) => {
    return (
        <Button asChild variant={"outline"} className={cn("bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg", isactive && "bg-black text-white hover:bg-black hover:text-white")}>

            <Link href={href}>
                {children}
            </Link>
        </Button>
    )

}

const navbarItems = [
    { href: "/", children: "Home" },
    { href: "/about", children: "About" },
    { href: "/contact", children: "Contact" },
    { href: "/features", children: "features" },
    { href: "/pricing", children: "Pricing" },

]

export const Navbar = () => {
    const pathname = usePathname();
    //A Client Component hook that lets you read the current URL's pathname.
    return (
        <nav className="h-20 flex justify-between bg-white font-medium">
            <Link href="/" className="pl-6 flex items-center">
                <span className={cn("text-5xl font-semibold", poppins.className)}>
                    funroad
                </span>
            </Link>

            <div className=" pr-6 items-center justify-center gap-4 hidden lg:flex ">
                {
                    navbarItems.map((Item) =>
                    (
                        <NavbarItems key={Item.href} href={Item.href} isactive={pathname === Item.href}>
                            {Item.children}
                        </NavbarItems>
                    ))
                }

            </div>

            <div className="hidden lg:flex">
                <Button asChild variant={"secondary"} className="bg-white border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none hover:bg-pink-400 transition-colors text-lg">
                    <Link href={"/sign-in"}>
                        Login
                    </Link>
                </Button>

                <Button asChild variant={"secondary"} className="bg-black text-white border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none hover:bg-pink-400 hover:text-black transition-colors text-lg">
                    <Link href={"/sign-up"}>
                    Sign Up
                    </Link>
                </Button>
            </div>
        </nav>
    )
}
