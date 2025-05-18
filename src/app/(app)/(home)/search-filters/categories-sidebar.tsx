import { CustomCategory } from "../types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"


interface props {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    data: CustomCategory[]

}

export const CategoriesSidebar = ({ open, onOpenChange, data }: props) => {

    const router = useRouter()

    //When you click a category with subcategories, it gets set to that category’s subcategories (an array). Controls which list of categories is currently shown in the sidebar.
    const [parentCategories, setParentCategory] = useState<CustomCategory[] | null>(null)


    // When you click a category with subcategories, it gets set to that category (the one you clicked). Used to keep track of which parent category you’re currently viewing.

    const [selectedCategories, setSelectedCategory] = useState<CustomCategory | null>(null)

    // if we have the parent categories then show those otherwise show root categories

    const currentCategory = parentCategories ?? data ?? [];

    const handleCategoryClick = (category: CustomCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategory(category.subcategories as CustomCategory[])
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