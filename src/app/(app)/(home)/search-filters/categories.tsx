
'use client'

import { CategoryDropdown } from "./category-dropdown"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ListFilterIcon } from "lucide-react"

import { CategoriesSidebar } from "./categories-sidebar"
import { CategoriesGetManyOutput } from "@/modules/categories/types"

interface props {
    data: CategoriesGetManyOutput
}
// import {
//     HoverCard,
//     HoverCardContent,
//     HoverCardTrigger,
// } from "@/components/ui/hover-card"

export const Categories = ({ data }: props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)
    const viewAllRef = useRef<HTMLDivElement>(null)

    const [visibleCount, setVisibleCount] = useState(data.length)
    const [isAnyHovered, setIsAnyHovered] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const activeCategory = 'all'

    // suppose we have 10 categories and we want to show only 5 categories in the navbar, so we will set the visibleCount to 5, and the rest of the categories will be hidden in a dropdown
    //so suppose a hidden category is active then we have to highlight the view all button, so we will check if the active category is in the hidden categories or not, if yes then we will highlight the view all button
    // so we will find the index of the active category in the data array, and if it is greater than the visibleCount then we will highlight the view all button
    const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory)
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

    useEffect(() => {
        const calculateVisible = () => {
            if (!containerRef.current || !viewAllRef.current || !measureRef.current) {
                return
            }
            const containerWidth = containerRef.current.offsetWidth
            const viewAllWidth = viewAllRef.current.offsetWidth
            const availableWidth = containerWidth - viewAllWidth // 20 is the margin between the categories and view all button


            const items = Array.from(measureRef.current.children)
            let totalWidth = 0
            let visible = 0

            for (const item of items) {
                const width = item.getBoundingClientRect().width
                if (totalWidth + width > availableWidth) break;
                totalWidth += width
                visible++

            }
            setVisibleCount(visible)
        }

        const resizeObserver = new ResizeObserver(calculateVisible)
        resizeObserver.observe(containerRef.current!)
        return () => resizeObserver.disconnect()


    }, [data.length])


    return (
        <div className="relative w-full">

            {/* hidden div to measure all items */}
            <div ref={measureRef} className="absolute opacity-0 pointer-events-none flex" style={{
                position: 'fixed', top: -9999, left: -9999
            }}>

                {
                    data.map((category) => (
                        <CategoryDropdown key={category.id} category={category} isActive={activeCategory === category.slug} isNavigationHovered={false} />
                        // now isActive is false initially, but when we hover on the category then it will be true and the subcategories will be shown
                        //now we have a category called 'all' which is a permanent active button, so we just put a logic to make the all category active (activeCategory===category.slug), if the condition fails then it will be false
                    ))
                }
            </div>

            {/* visible div */}

            <div className="flex flex-nowrap items-center" ref={containerRef} onMouseEnter={() => setIsAnyHovered(true)} onMouseLeave={() => setIsAnyHovered(false)}>

                {
                    data.slice(0, visibleCount).map((category) => (
                        <CategoryDropdown key={category.id} category={category} isActive={activeCategory === category.slug} isNavigationHovered={false} />
                        // now isActive is false initially, but when we hover on the category then it will be true and the subcategories will be shown
                        //now we have a category called 'all' which is a permanent active button, so we just put a logic to make the all category active (activeCategory===category.slug), if the condition fails then it will be false
                    ))
                }

                <div ref={viewAllRef} className="shrink-0">
                    <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black", isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary")}>
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>

                </div>
            </div>
            {/* When a person click on view all then  a sidebar will open */}

            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

        </div>

    )
}


// This is my solution of categories
// I used hover card of shadCn to show the subcategories of each category
// result.map((item) => (
//     item.subcategories.length !== 0 ? <div key={item.id}>
//         <HoverCard >
//             <HoverCardTrigger className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition-all duration-200 ease-in-out">
//                 {item.name}
//             </HoverCardTrigger>
//             <HoverCardContent side="left" className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
//                 <div className="flex flex-col gap-2">
//                     {item.subcategories.map((sub) => (
//                         <div key={sub.id} className="flex gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition-all duration-200 ease-in-out">
//                             {sub.name}
//                         </div>
//                     ))}
//                 </div>
//             </HoverCardContent>
//         </HoverCard>
//     </div> : <div key={item.id} className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition-all duration-200 ease-in-out">
//         {item.name}
//     </div>
// ))


// function categories({ data }: props) {
//     return (
//         <div>

//         </div>
//     )
// }

// export default categories
