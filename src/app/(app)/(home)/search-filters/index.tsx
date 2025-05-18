import { SearchInput } from "./search-index"
import { Categories } from "./categories"
import { CustomCategory } from "../types"

interface props {
    data: CustomCategory[]
}

export const SearchFilters = ({ data }: props) => {
    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput data={data} />
            <div className="hidden lg:block">
                <Categories data={data} />
            </div>

        </div>
    )
}


