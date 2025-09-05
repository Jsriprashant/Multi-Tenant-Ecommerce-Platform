

// when eveer we click on a category it will go to http://localhost:3000/drawing-painting

import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductListView } from '@/modules/products/ui/views/product-list-view'

import React from 'react'
import type { SearchParams } from 'nuqs/server'
// import { loadProductFilters } from '@/modules/products/hooks/product-filter-hooks'
import { loadProductFilters } from '@/modules/products/search-params'
import { DEFAULT_LIMIT } from '@/constants'


interface Props {

  // we will extract the category (drawing-painting) from url http://localhost:3000/drawing-painting and then display it 
  searchParams: Promise<SearchParams>
}

//  http://localhost:3000/drawing-painting
//  http://localhost:3000/{category}


async function Page({ searchParams }: Props) {
  // const { category } = await params

  const filters = await loadProductFilters(searchParams)

  // console.log(JSON.stringify(filters), "THis is from RFC")


  const queryClient = getQueryClient()
  // void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
  //     category,
  //     ...filters
  //     // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
  // }))
  // now as in the components we are using infinite queries so we cannot usePrefetch we must use infinite predetch

  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    limit: DEFAULT_LIMIT,
    // now we need to prefetch the data with the filters so we have modified the src\modules\products\hooks\product-filter-hooks.ts
  }))

  // destructuring the category from await params

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}

export default Page





// 'use client'

// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// // if the component is client then we have do use trpc it differently
// export default function Home() {

//   const trpc = useTRPC();
//   const { data } = useQuery(trpc.auth.session.queryOptions())

//   return (
//     <div>
//       {
//         // JSON.stringify(data, null, 2)
//         // this is the whole auth object that we got
//         // { "permissions": { "collections": { "media": { "fields": { "alt": { "read": true }, "updatedAt": { "read": true }, "createdAt": { "read": true }, "url": { "read": true }, "thumbnailURL": { "read": true }, "filename": { "read": true }, "mimeType": { "read": true }, "filesize": { "read": true }, "width": { "read": true }, "height": { "read": true }, "focalX": { "read": true }, "focalY": { "read": true } }, "read": true } } }, "user": null }

//         JSON.stringify(data?.user, null, 2)
//         // initially it will be null as there are no user and no sesssion is created for any user
//       }
//     </div>
//   )






// return (
//   <div>
//     <p>Is Loading:{`${categories.isLoading}`} </p>
//     {
//       JSON.stringify(categories.data, null, 2)
//     }
//   </div>
//   // this is how the categories look like when we fetch it with client component
//   // CATEGORIES: { "status": "success", "fetchStatus": "idle", "isPending": false, "isSuccess": true, "isError": false, "isInitialLoading": false, "isLoading": false, "data": [ { "hello": "Hello world" } ], "dataUpdatedAt": 1747775666749, "error": null, "errorUpdatedAt": 0, "failureCount": 0, "failureReason": null, "errorUpdateCount": 0, "isFetched": true, "isFetchedAfterMount": true, "isFetching": false, "isRefetching": false, "isLoadingError": false, "isPaused": false, "isPlaceholderData": false, "isRefetchError": false, "isStale": true, "promise": { "status": "rejected", "reason": {} } }



// );


// this code works well if the component is a server componet
// what to do if component is client
// export default async function Home() {
//   const queryClient = getQueryClient();
//   const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions())

//   return (
//     <div>
//       {
//         JSON.stringify(categories, null, 2)
//       }
//     </div>




//   );
// }

// moved page.tsx (preexisting codes) from src/app/page.tsx to src/app/(home)/page.tsx

// 'use client'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'

// export default async function Home() {
//   // const payload = await getPayload({
//   //   config: configPromise,
//   // })

//   // const data = await payload.find({
//   //   collection: 'categories',
//   //   // in the fronetend we need to show only the main categories
//   //   // so while getting the data we add a filter or where condition to get only the main categories
//   //   // in the 'where' we are checking if the parent field is empty or not
//   //   //if yes then only the category is stored in 'data' variable
//   //   where: {
//   //     parent: {
//   //       exists: false
//   //     }
//   //   }
//   // })
//   return (
//     <div>
//       Home Page
//     </div>
//     // <div className="flex flex-col gap-y-4 p-1 m-1">
//     //   <div>

//     //     <Button variant={"outline"}> Hello World</Button>
//     //   </div>
//     //   <Input placeholder="Enter something"></Input>
//     //   <Progress value={50}></Progress>
//     //   <Textarea placeholder=" INput text here " onChange={(e) => { console.log(e.target.value) }}></Textarea>
//     //   <Checkbox></Checkbox>

//     // </div>



//   );
// }