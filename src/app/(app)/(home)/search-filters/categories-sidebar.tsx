'use client'
// import { CustomCategory } from "../types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { CategoriesGetManyOutput } from "@/modules/categories/types"


interface props {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    // data: CustomCategory[]

}

// export const CategoriesSidebar = ({ open, onOpenChange, data }: props) => {

export const CategoriesSidebar = ({ open, onOpenChange }: props) => {
    const router = useRouter()

    // here also we can fetch the data from the server directly
    const trpc = useTRPC();
    const { data } = useQuery(trpc.categories.getMany.queryOptions());

    //When you click a category with subcategories, it gets set to that category’s subcategories (an array). Controls which list of categories is currently shown in the sidebar.
    const [parentCategories, setParentCategory] = useState<CategoriesGetManyOutput | null>(null)


    // When you click a category with subcategories, it gets set to that category (the one you clicked). Used to keep track of which parent category you’re currently viewing.

    const [selectedCategories, setSelectedCategory] = useState<CategoriesGetManyOutput[1] | null>(null)

    // if we have the parent categories then show those otherwise show root categories

    const currentCategory = parentCategories ?? data ?? [];

    const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategory(category.subcategories as CategoriesGetManyOutput)
            setSelectedCategory(category)
        }
        else {
            // this is a leaf category no subcategories
            if (parentCategories && selectedCategories) {
                // this is a subcategory - navigate to the subcategory
                router.push(`/${selectedCategories.slug}/${category.slug}`)
            }
            else {
                // this is a root category - navigate to the category
                if (category.slug === 'all') {
                    router.push('/')

                } else {
                    router.push(`/${category.slug}`)
                }
            }
            // close the sidebar when we are redirecting
            handleOpenChange(false)

        }
    }

    const handleOpenChange = (open: boolean) => {
        setSelectedCategory(null)
        setParentCategory(null)
        onOpenChange(open)
    }

    const handleBackClick = () => {
        if (parentCategories) {
            setParentCategory(null)
            setSelectedCategory(null)
        }
    }

    const backgroundColor = selectedCategories?.color || "white"

    return (
        <Sheet open={open} onOpenChange={handleOpenChange} >

            <SheetContent side="left" className="p-0 transition-none" style={{ backgroundColor: backgroundColor }}>
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>


                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {
                        parentCategories && (
                            <button onClick={handleBackClick} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer">

                                <ChevronLeftIcon className="size-4 mr-2" />
                                Back

                            </button>
                        )
                    }
                    {
                        currentCategory.map((category) => (
                            <button key={category.slug} className="w-full text-left p-4 hover:bg-black justify-between hover:text-white flex items-center text-base font-medium cursor-pointer" onClick={() => handleCategoryClick(category)}>

                                {category.name}
                                {category.subcategories.length > 0 && (
                                    <ChevronRightIcon className="size-4 mr-2" />
                                )}



                            </button>
                        ))
                    }

                </ScrollArea>


            </SheetContent>


        </Sheet>
    )

}