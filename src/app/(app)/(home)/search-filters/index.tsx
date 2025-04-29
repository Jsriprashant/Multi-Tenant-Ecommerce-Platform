import { SearchInput } from "./search-index"
import { Categories } from "./categories"

interface props {
    data: object
}

export const SearchFilters = ({ data }: props) => {
    return (
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
            <SearchInput />
            <Categories data={data} />

        </div>
    )
}


