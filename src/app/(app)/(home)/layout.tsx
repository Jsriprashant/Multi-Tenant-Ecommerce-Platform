import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { SearchFilterLoading, SearchFilters } from "./search-filters"


// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
// import { Category } from "@/payload-types"
// import { CustomCategory } from "./types"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

interface Props {
    children: React.ReactNode
}

// const sample data, we fill this data manually in the Database for testting purposes
// const categories = [
//     {
//         name: "All",
//         slug: "all",
//     },
//     {
//         name: "Business & Money",
//         color: "#FFB347",
//         slug: "business-money",
//         subcategories: [
//             { name: "Accounting", slug: "accounting" },
//             {
//                 name: "Entrepreneurship",
//                 slug: "entrepreneurship",
//             },
//             { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
//             { name: "Investing", slug: "investing" },
//             { name: "Management & Leadership", slug: "management-leadership" },
//             {
//                 name: "Marketing & Sales",
//                 slug: "marketing-sales",
//             },
//             { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
//             { name: "Personal Finance", slug: "personal-finance" },
//             { name: "Real Estate", slug: "real-estate" },
//         ],
//     },
//     {
//         name: "Software Development",
//         color: "#7EC8E3",
//         slug: "software-development",
//         subcategories: [
//             { name: "Web Development", slug: "web-development" },
//             { name: "Mobile Development", slug: "mobile-development" },
//             { name: "Game Development", slug: "game-development" },
//             { name: "Programming Languages", slug: "programming-languages" },
//             { name: "DevOps", slug: "devops" },
//         ],
//     },
//     {
//         name: "Writing & Publishing",
//         color: "#D8B5FF",
//         slug: "writing-publishing",
//         subcategories: [
//             { name: "Fiction", slug: "fiction" },
//             { name: "Non-Fiction", slug: "non-fiction" },
//             { name: "Blogging", slug: "blogging" },
//             { name: "Copywriting", slug: "copywriting" },
//             { name: "Self-Publishing", slug: "self-publishing" },
//         ],
//     },
//     {
//         name: "Other",
//         slug: "other",
//     },
//     {
//         name: "Education",
//         color: "#FFE066",
//         slug: "education",
//         subcategories: [
//             { name: "Online Courses", slug: "online-courses" },
//             { name: "Tutoring", slug: "tutoring" },
//             { name: "Test Preparation", slug: "test-preparation" },
//             { name: "Language Learning", slug: "language-learning" },
//         ],
//     },
//     {
//         name: "Self Improvement",
//         color: "#96E6B3",
//         slug: "self-improvement",
//         subcategories: [
//             { name: "Productivity", slug: "productivity" },
//             { name: "Personal Development", slug: "personal-development" },
//             { name: "Mindfulness", slug: "mindfulness" },
//             { name: "Career Growth", slug: "career-growth" },
//         ],
//     },
//     {
//         name: "Fitness & Health",
//         color: "#FF9AA2",
//         slug: "fitness-health",
//         subcategories: [
//             { name: "Workout Plans", slug: "workout-plans" },
//             { name: "Nutrition", slug: "nutrition" },
//             { name: "Mental Health", slug: "mental-health" },
//             { name: "Yoga", slug: "yoga" },
//         ],
//     },
//     {
//         name: "Design",
//         color: "#B5B9FF",
//         slug: "design",
//         subcategories: [
//             { name: "UI/UX", slug: "ui-ux" },
//             { name: "Graphic Design", slug: "graphic-design" },
//             { name: "3D Modeling", slug: "3d-modeling" },
//             { name: "Typography", slug: "typography" },
//         ],
//     },
//     {
//         name: "Drawing & Painting",
//         color: "#FFCAB0",
//         slug: "drawing-painting",
//         subcategories: [
//             { name: "Watercolor", slug: "watercolor" },
//             { name: "Acrylic", slug: "acrylic" },
//             { name: "Oil", slug: "oil" },
//             { name: "Pastel", slug: "pastel" },
//             { name: "Charcoal", slug: "charcoal" },
//         ],
//     },
//     {
//         name: "Music",
//         color: "#FFD700",
//         slug: "music",
//         subcategories: [
//             { name: "Songwriting", slug: "songwriting" },
//             { name: "Music Production", slug: "music-production" },
//             { name: "Music Theory", slug: "music-theory" },
//             { name: "Music History", slug: "music-history" },
//         ],
//     },
//     {
//         name: "Photography",
//         color: "#FF6B6B",
//         slug: "photography",
//         subcategories: [
//             { name: "Portrait", slug: "portrait" },
//             { name: "Landscape", slug: "landscape" },
//             { name: "Street Photography", slug: "street-photography" },
//             { name: "Nature", slug: "nature" },
//             { name: "Macro", slug: "macro" },
//         ],
//     },
// ]
// funciton to insert the data manually in the DB
// const seed = async (payload: CustomCategory[]) => {

//     for (const category of categories) {
//         const parentCategory = await payload.create({
//             collection: "categories",
//             data: {
//                 name: category.name,
//                 slug: category.slug,
//                 color: category.color,
//                 parent: null
//             }

//         })

//         for (const subcategory of category.subcategories || []) {

//             await payload.create({
//                 collection: "categories",
//                 data: {
//                     name: subcategory.name,
//                     slug: subcategory.slug,
//                     parent: parentCategory.id

//                 }
//             })
//         }

//     }
// }


async function Layout({ children }: Props) {
    // this is another way to get the payload instance
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

    // const payload = await getPayload({
    //     config: configPromise,
    // })


    // function should be run only once as, after inserting in DB if we start the server again then again insertion will cause error, as unique is true for Categories collection

    // await seed(payload)

    // const data = await payload.find({
    //     collection: 'categories',
    //     pagination: false,
    //     depth: 1,
    //     // in the fronetend we need to show only the main categories
    //     // so while getting the data we add a filter or where condition to get only the main categories
    //     // in the 'where' we are checking if the parent field is empty or not
    //     //if yes then only the category is stored in 'data' variable
    //     where: {
    //         parent: {
    //             exists: false
    //         }
    //     },
    //     sort: 'name', // sort by name in ascending order
    // })

    // const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    //     ...doc,
    //     subcategories: (doc.subcategories?.docs ?? []).map((subdoc) => ({
    //         //by provideing depth 1 the pyload dows not know that the subdoc is of type category or not
    //         // and because of depth 1 we are confident that subdoc will have a type of category
    //         //so we add a type to the subdoc, which is Category

    //         ...(subdoc as Category)
    //     }))
    // }))



    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* <SearchFilters data={formattedData} /> */}

            {/* new way of passing the formatted Data */}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<SearchFilterLoading />}>
                    <SearchFilters />
                </Suspense>
            </HydrationBoundary>


            <div className="flex-1 bg-[#f4f4f0]">
                {children}

            </div>
            <Footer />

        </div>
    )
}

export default Layout
