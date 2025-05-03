// import { Category } from "@/payload-types"
'use client'

import { useRef, useState } from "react"


import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDropdownPosition } from "./use-dropdown-position"
import { SubCategoryMenu } from "./subCategory-menu"

interface props {
    category: any
    isActive?: boolean
    isNavigationHovered?: boolean
}

export const CategoryDropdown = ({ category, isActive, isNavigationHovered }: props) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { getDropdownPosition } = useDropdownPosition(dropdownRef)
    const dropdownPosition = getDropdownPosition()
    // one question how to decide at whoich positon we have open the dropdown
    // so we created another function for it

    // in this funciton we pass the reference (ref) of the div inside which we we have our categories (the top div, which is wrapping the button)


    const onMouseEnter = () => {
        console.log("Subcategories:", category.subcategories)
        if (category.subcategories.length > 0) {
            setIsOpen(true)
        }
    }

    const onMouseLeave = () => {
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="relative">
                <Button variant={"elevated"} className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black", isActive && !isNavigationHovered && "bg-white border-primary")}>
                    {category.name}
                </Button>
                {category && category.subcategories.length > 0 && (
                    <div
                        className={cn(
                            "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
                            isOpen && "opacity-100"
                        )}
                    />
                    // this div is used to create a triangle effect for the dropdown
                    // it is positioned absolutely and the border is used to create the triangle effect
                )}
            </div>

            {/* we have passed the positon that we got from the getPosition funciton to subCategoryMenu compoent */}

            <SubCategoryMenu category={category} position={dropdownPosition} isOpen={isOpen} />
        </div>
    )
}


