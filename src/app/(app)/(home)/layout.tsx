import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { SearchFilters } from "./search-filters"

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Category } from "@/payload-types"

interface Props {
    children: React.ReactNode
}

async function Layout({ children }: Props) {

    const payload = await getPayload({
        config: configPromise,
    })

    const data = await payload.find({
        collection: 'categories',
        pagination: false,
        depth: 1,
        // in the fronetend we need to show only the main categories
        // so while getting the data we add a filter or where condition to get only the main categories
        // in the 'where' we are checking if the parent field is empty or not
        //if yes then only the category is stored in 'data' variable
        where: {
            parent: {
                exists: false
            }
        }
    })

    const formattedData = data.docs.map((doc) => ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((subdoc) => ({
            //by provideing depth 1 the pyload dows not know that the subdoc is of type category or not
            // and because of depth 1 we are confident that subdoc will have a type of category
            //so we add a type to the subdoc, which is Category

            ...(subdoc as Category)
        }))
    }))



    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <SearchFilters data={formattedData} />


            <div className="flex-1 bg-[#f4f4f0]">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout
