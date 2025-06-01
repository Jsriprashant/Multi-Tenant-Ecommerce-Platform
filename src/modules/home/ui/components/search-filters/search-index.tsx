'use client'

import { Input } from "@/components/ui/input"
import { BookmarkCheckIcon, SearchIcon } from "lucide-react"

import { useState } from "react"

import { CategoriesSidebar } from "./categories-sidebar"
import { Button } from "@/components/ui/button"
import { ListFilterIcon } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

import Link from 'next/link'

interface props {
    disabled: boolean

}

export const SearchInput = ({ disabled }: props) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const trpc = useTRPC();
    const { data } = useQuery(trpc.auth.session.queryOptions())

    return (
        <div className="flex items-center gap-2 w-full ">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <Input className="pl-8" placeholder="Search Products" disabled={disabled} />

            </div>
            <Button variant={"elevated"} className="size-12 shrink-0 flex lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <ListFilterIcon className="size-4" />
            </Button>


            {/* In future add viewAll button */}
            {/* in future add library button */}

            {
                data?.user && (
                    <Button asChild variant={"elevated"}>
                        <Link href={"/library"}>
                            <BookmarkCheckIcon />
                            Library
                        </Link>


                    </Button>
                )
            }

        </div>
    )

}