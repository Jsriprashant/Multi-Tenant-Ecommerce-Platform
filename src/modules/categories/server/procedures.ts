import { baseProcedure, createTRPCRouter } from "@/trpc/init";


// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import { Category } from "@/payload-types"



export const categoriesRouter = createTRPCRouter({

    getMany: baseProcedure.query(async ({ ctx }) => {

        // const payload = await getPayload({
        //     config: configPromise,
        // })
        // instead of writing this payload in every procedure we are going to make changes in the baseProcedure routers/init.ts file. we will add this as a middle ware there

        const data = await ctx.db.find({
            // here pauload is renamed to db because we have added context of db to payload
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
            },
            sort: 'name', // sort by name in ascending order
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

        return formattedData
    })

})