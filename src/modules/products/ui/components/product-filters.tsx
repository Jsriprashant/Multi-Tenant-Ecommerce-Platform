'use client'
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react"
import { PriceFilter } from "./price-filter";

import { useProductFilter } from "../../hooks/product-filter-hooks";

interface ProductFilterProps {
    title: string,
    className?: string,
    children: React.ReactNode

}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon
    // capitalized variable so that we can us it as a component

    return (
        <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
            <div onClick={() => setIsOpen((current) => !current)} className="flex items-center justify-between cursor-pointer" >
                <p className="font-medium">{title}</p>
                <Icon className="size-5" />
            </div>
            {isOpen && children}
        </div>
    )


}

export const ProductFilters = () => {
    const [filters, setFilters] = useProductFilter();

    const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters({ ...filters, [key]: value })
    }


    return (
        <div className="border rounded-md bg-white">
            <div className="p-4 border-b flex items-center justify-between">
                <p className="font-medium">Filters</p>
                <button className="underline " onClick={() => { }} type="button">
                    clear
                </button>
            </div>
            <ProductFilter title="Price" className="border-b-0">
                <PriceFilter minPrice={filters.minPrice} maxPrice={filters.maxPrice} onMinPriceChange={(value) => onChange("minPrice", value)} onMaxPriceChange={(value) => onChange("maxPrice", value)} />
            </ProductFilter>
            {/* uses the product filter template from above */}

        </div>
    )

}