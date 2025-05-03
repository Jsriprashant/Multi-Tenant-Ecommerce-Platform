
import { CategoryDropdown } from "./category-dropdown"

interface props {
    data: any
}
// import {
//     HoverCard,
//     HoverCardContent,
//     HoverCardTrigger,
// } from "@/components/ui/hover-card"
import { Category } from "@/payload-types"

export const Categories = ({ data }: props) => {


    return (
        <div className="relative w-full">
            <div className="flex flex-nowrap items-center">

                {
                    data.map((category: Category) => (
                        <CategoryDropdown key={category.id} category={category} isActive={false} isNavigationHovered={false} />

                    ))
                }
            </div>
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
