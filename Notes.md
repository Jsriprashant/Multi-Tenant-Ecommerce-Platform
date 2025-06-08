Some Notes reagarding the project, tips and tricks, useful concepts and much more

1) For routing in Next js we can create a folder inside src folder and name the folder with the route name and inside it we make a file page.tsx
    a) make sure that in the page.tsx, defalut export is used; named export does not work
            a.a) export const Page=()=>{.....} ==> named export
            a.b) const page=()=>{....}; export defalut Page ===> default export 
    
2) Above step is good but, it might become little hectic to manage large folders
    so we can group the routes also
    a) create a folder with parenthesis inside the src folder, i.e. src/(home)
            a.a) this ( ) represents the group, it is only used for organisational purposes
            a.b) ( ) means that we dont need to include it in the url 
                    e.g. src/(home)/test/Page.tsx
                    To access the test page the url will be localhost:8000/test
                        dont need to include (home) in it localhost:8000/(home)/test ---> this is worng

In Next.js, when you create a Layout component, it is used to wrap the content of a page. The children prop is automatically populated with the content of the page that the layout is wrapping.

For example:

1) You have a Layout.tsx file in the (home) folder.
2) Inside this folder, there is likely a page.tsx file (or similar).
3) When Next.js renders the page.tsx file, it automatically wraps the page content with the Layout component if the Layout.tsx file is present in the same folder.

IMP-> also if we create sub directories inside the (home) ie, src/(home)/foo/page.txs
then no need to create another layout.tsx inside foo folder

Now when we write use client at the top, it does not mean that the component is transformed to a client component.
everything is a server component at first, by writing use client at top we are opening a portal from server to client.
now if we put use client in teh layout.tsx then every componets present in layout.tsx has a portal to the client component (every compoent is not converted to client compoent)
which means that compoents can pass through that portal 
BUTTTTT.... that does not mean that the {childrens} in layout.txs will also client compoent, it will not be able to pass through the poratal, as the portal is opened in layout,tsx file not in {childres} file

One more thing, writing use client does not means that componet gets rendred at client, still it is rendredn in server only
servers side rendering and server side compont both are differernt

find out
// what are sheet, sheet area,
// use sidebar tool on shadcn
// what is flex-1


Some notes to create the categories field
// i could do it with schadCN's Hovercard, but need to adjust the css 

Antonio did it in a differnt way
1) created Category collection using mongoDb --> refer to collections/Categories
2) then we extracted teh data from the DB in the layout.tsx file and passed the whole data as prop to searchfilter component
3) searchFilter component is defined in index.tsx 
4) then we send the data to Categories compoent defined in Categories.tsx, this is where we display the Data
5) but each category has subcategories, so on hover the subcategories should be displayed
6) so we send the each Category data as prop to the CategoryDropdown compoent
7) in category-dropdown we have defined the CategoryDropdown compoent
8) we created a function getDropdown position(defined in use-dropdown-Position) to get the accurate position of where should the subcategory bar should be displayed, proper checks were done so that the subcategory bar does not get out of screen

9) we send the position and the data to another compoent SubCategoryMenu defined in subcategory-menu.tsx where we sucessfully displayed the subcategories

// go through each and every filename mentioned above so that i can get a clea understanding, as some intersting techniques are used 

One beautiful concept of react rerendering from the file categories-sidebar.tsx file
    what is the problem?
        So we created a viewAll button and on clicking it we should see a sidebar with all the categories, so for the sidebar we created another component categories-sidebar.tsx.

        In this component we have created 2 Usetates parentcategory and selectedcategory, parent category has the array of the subcategory that a parent category has when a parent category is selected
        And the selected category has the parent category that is selected

        now we have created a variable currentCategory which initially has the data (which came to)
        const currentCategory = PreantCategory??data??[];

        So i was wondering ki initially parent category is null so current cat has data, and in the component data is rendered usinf sheetcontent

        but when we clicked on a parent category then how does the currentCategory gets updated as it was defined outside the funciton.
    answer> So as parentCteegory is a usestate, so when ever we update the parentCategory then the whole component gets rendered so the currentcategory is recalculated using the new state. 

#TRPC     
RPC is short for "Remote Procedure Call". It is a way of calling functions on one computer (the server) from another computer (the client). With traditional HTTP/REST APIs, you call a URL and get a response. With RPC, you call a function and get a response.
// HTTP/REST
const res = await fetch('/api/users/1');
const user = await res.json();
// RPC
const user = await api.users.getById({ id: 1 });

While testing the api from page.tsx a strange thing happens
when teh page.tsx was server component then we could directly use async await and fetch the data from the DB
But when we made the component client based then it was showing error 
WHy?
as server compoents can directly talk to db, but client components must use fetch api to fetch the data from the server
How it was resolved -> by adding this app/api/trpc/[trpc]/route.ts file 


POINTS TO PONDER
what is ctx in the C:\Users\KIIT\OneDrive\Desktop\WEB DEV\multi-tenant-application\src\trpc\init.ts 's base procedure

STEPS on how trpc was intergrated in this project.
1) Set up a router.
    -> in trpc router is a set of functions or procedures that can be called from front end
    ->we set up a router named categories in src\modules\categories\server\procedures.ts
    -> this file has a router named categoriesRouter, which has a function named getMany which extracts the data from the DB and formats it and returns it

2) After setting up all the routers we have to setup a server and combine all the router's definition in a single app router, so that we can get access to all the routres from anywhere
    -> basically setting up a trpc server handler
    -> we did this in src\trpc\routers\_app.ts

3) Now we set a trpc client that knows how to call backend procedures, because internally it works by fetch only
    -> src\trpc\client.tsx
3.1) Now not only we can call the routers or procedures from client, but from server also, so we set a trpc server that knows hows to call procedures from server components
    -> src\trpc\server.ts

Now we are ready to use trpc or the procedures defined in components
-> we have 2 ways for it, either we can fetch directly using server components using   
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()) 
    we can use the by this we can use async await 
-> or we can use trpc hooks in the client components to call the server procedures or funcitons
    const trpc = useTRPC();
    const { data } = useQuery(trpc.categories.getMany.queryOptions());  

// ASk gpt for the explanation of the codes of trpc from this trpc.categories.getMany.queryOptions() call, to each file it goes.

SETUP AUTHENTICATION
some questions. what does prefetch do in src\app\(app)\(home)\navbar.tsx
what is .mutation in src\modules\auth\server\procedures.ts
how does req and res (data from frontend) comes to the procedures?
what is zinfer from src\modules\auth\ui\views\sign-up-view.tsx?

how can we write tailwind css outside of app folder, as tailwind needs to be configured manually on whre to look for tailwind css in tailwind.config.ts file?
ANS-> In next JS they made a mechanism which automatically searches the whole codebase to fing tailwind css, so this is 

why in src\modules\auth\ui\views\sign-up-view.tsx we are calling the onsubmit by form.handleSubmit(onSubmit)?
so by this onsubmit funciton does not get called until unless zod performs it validation (which means zod checks from the input schema that if all the required inputs are present and all teh conditions are matched or not)

// Now when we type username in sign-up page then the username validation is done on the spot. how?
    to actively observe username we use form.watch
        const username = form.watch('username')
    actively watches the errors
        const usernameErrors = form.formState.errors.username
    has username only when usernameerors sre not present
        const showPreview = username && !usernameError
    
then we just render this 
 <FormDescription className={cn("hidden", showPreview && "block")}>
    Your store will be available at {" "}
    <strong>{username}</strong>
</FormDescription>
<FormMessage />

Now still you have to press enter then only the message would show error as the form message, how to show errors in the username in realtime?

we just put mode:'all'
const form = useForm<z.infer<typeof registerSchema>>({
        mode:"all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            username: ''
        }
    })

questions to ponder, how does errors get displayes as in <formMessage> component we hav'nt passed any usernameerror?

How we send the form data to the server?
    const trpc = useTRPC();
    const register = useMutation(trpc.auth.register.mutationOptions())

    // values are the form data in object form (same as the register schema)
    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

Implementation of sign in in a different way, with rest cookies
// why? -> as with the previous implementation we had to use a strict name for our auth_cookie which is 'payload-token' then only our cookies got saved.

// now, we will be using rest api to login the user.
-> by this we dont need to manually set the cookie, this will automatically set the cookie on login
-> but we are not doing this.

-> so we created a safer way to use trpc and generate cookies
    created a generate cookie funciton src\modules\auth\utils.ts in this file
    To generate the cookies safely we are using prefix in the  name: `${prefix}-token`, this is coming from payload itself

// Now to ensure that we cannot go to login screen again after logging in
    we created a server caller in the src\trpc\server.ts
    then, we used this caller to call the session funciton directly from the server, by this we do not store anything on the cache (if we called the session from client then cache was mantained) src\app\(app)\(auth)\sign-in\page.tsx


To ponder:
-> why are we using invalidatequeries in src\modules\auth\ui\views\sign-in-view.tsx ??

ANS) invalidateQueries is a function from React Query.
It marks cached data as "stale" for a specific query (here, the session).
This tells React Query to refetch the session data the next time it’s needed.

Questions to ponder
1) is it necessary to put subcategory inside category?
-> becuse every subsequent page.tsx inside ([categories]) has access to the parent which means subcategories has access to page.tsx of categories but vice versa is not true


2) what is the science of the dynamic router. how routing is being done?

3) why a promise is required to extract params?, we added a promise in the props interface of [categories] and then extract the params by await?
4) while extracting data form url using useParams, why are we sure to use .category with it?

// Evry answer to each question is present in copilot chat

# Now we are defining the product collections
    payload also takes care of image uploads to mongoDb and uptill now i guess no multer is required
When opening localhost:3000/admin, and going to products category we will see that the options in the categories are in id form, beacuse by default only id is shown, to tacke that we added
  admin: {
        useAsTitle: "name"
    },
in the categories collection
    Now you'll see that all also appears in the category option, so in future we will hard code a all button and remove it from the categories collection

Pondering questions.
    What is depth in the products procedures src\modules\products\server\procedures.ts
    explain this
        Where["category.slug"] = {
                        equals: category.slug
                                }

    Why did we fetch the product in both product list and src\app\(app)\(home)\[category]\page.tsx??

One trick i learned is
   void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
    }))
now, in the getmanu funciton, our input is of name category, so we cannot pass subcategory to it so this is a way around to send subcategory with the name of the prop category

// understand the src\modules\products\server\procedures.ts on how it is fetching the subcategories, and what if subcateogries are not present then?


One intresting problem that i encountered was
now localhost:3000/favicon.ico (gets loaded automatically) and localhost:3000/business-and-money
we can see that both are on the same level (as just inside app/(home)/[categories] router), so sometimes favicon.ico is treated as a category, which gives error as no categories are present which is favicon.ico
// so we have resolved it by checking if the parentcaetogry exists or not in the src\modules\products\server\procedures.ts line number 47, if it exists then only where slug is populated otherwise its not

// We are creating filtering component, to filter products based on price and other parameters
// for that we are using nuqs package to help with frontend

one more thing of usestate
setIsOpen((current) => !current) , by using current we can directly set the stateVarisble without using the isOpen or any other things

questions to Ponder:
1) what is changeEvent in src\modules\products\ui\components\price-filter.tsx ??
2) why are we using regex inside handleMinchange funciton, as it is already being done on the funciton above it ?
3) what is this   const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters({ ...filters, [key]: value })
    } inside src\modules\products\ui\components\product-filters.tsx

    
4)  if (input.minPrice) {
                where.minPrice = {
                    ...where.price,
                    greater_than_equal: input.minPrice
                }
                // these are price filters

            }
            if (input.maxPrice) {
                where.minPrice = {
                    ...where.price,
                    less_than_equal: input.maxPrice
                }

            }
why ...where.price is required?
