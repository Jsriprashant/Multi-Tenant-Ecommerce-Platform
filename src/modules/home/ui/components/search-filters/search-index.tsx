import { Input } from "@/components/ui/input"
import { BookmarkCheckIcon, SearchIcon } from "lucide-react"

import { useEffect, useState } from "react"

import { CategoriesSidebar } from "./categories-sidebar"
import { Button } from "@/components/ui/button"
import { ListFilterIcon } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

import Link from 'next/link'
// import { useProductFilter } from "@/modules/products/hooks/product-filter-hooks"

interface props {
    disabled?: boolean | false
    defaultValue?: string | undefined,
    onChange?: (value: string) => void


}

export const SearchInput = ({ disabled, defaultValue, onChange }: props) => {
    // const [filters, setFilters] = useProductFilter();
    const [searchValue, setSearchValue] = useState(defaultValue || "")

    // only after typing for half a second it fires an event --> basic debounce
    useEffect(() => {

        const timeOutId = setTimeout(() => {
            // calling the onChange optionally
            onChange?.(searchValue)
        }, 500);

        return () => clearTimeout(timeOutId)
    }, [searchValue, onChange])


    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const trpc = useTRPC();
    const { data } = useQuery(trpc.auth.session.queryOptions())

    return (
        <div className="flex items-center gap-2 w-full ">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />

                <Input className="pl-8" placeholder="Search Products" disabled={disabled} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />

            </div>
            <Button variant={"elevated"} className="size-12 shrink-0 flex lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <ListFilterIcon className="size-4" />
            </Button>


            {/* In future add viewAll button */}
            {/* in future add library button */}

            {
                data?.user && (
                    <Button asChild variant={"elevated"}>
                        <Link prefetch href={"/library"}>
                            <BookmarkCheckIcon />
                            Library
                        </Link>


                    </Button>
                )
            }

        </div>
    )

}