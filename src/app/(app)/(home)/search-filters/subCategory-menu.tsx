import { Category } from "@/payload-types"
import Link from "next/link";

interface props {
    category: Category,
    position: { top: number, left: number },
    isOpen: boolean

}


export const SubCategoryMenu = ({ category, position, isOpen }: props) => {
    if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
        return null;
    }

    const backgroundColor = category.color || '#F5F5F5'

    return (
        <div className="fixed z-100" style={{ top: position.top, left: position.left }}>
            <div className="h-3 w-60">
                {/* An invisible bridge to maintain the hover */}
                <div style={{ backgroundColor }} className=" w-60 m-2.5 text-black rounded-md border overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]">
                    <div>
                        {
                            category.subcategories?.map((subcat: Category) => (

                                <Link href="/" key={subcat.slug} className="w-full text-left p-4 hover:bg-black flex justify-between items-center underline font-medium hover:text-white">

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