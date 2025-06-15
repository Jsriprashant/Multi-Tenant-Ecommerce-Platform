import { Category } from "@/payload-types"
import Link from "next/link";

import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface props {
    category: CategoriesGetManyOutput[1],

    isOpen: boolean

}


export const SubCategoryMenu = ({ category, isOpen }: props) => {
    if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
        return null;
    }

    const backgroundColor = category.color || '#F5F5F5'

    return (
        <div className="absolute z-100" style={{ top: '100%', left: '0' }}>
            <div className="h-3 w-60">
                {/* An invisible bridge to maintain the hover */}
                <div style={{ backgroundColor }} className=" w-60 m-2.5 text-black rounded-md border overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]">
                    <div>
                        {
                            category.subcategories?.map((subcat: Category) => (

                                <Link href={`/${category.slug}/${subcat.slug}`} key={subcat.slug} className="w-full text-left p-4 hover:bg-black flex justify-between items-center underline font-medium hover:text-white">
                                    {subcat.name}
                                </Link>

                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )

}