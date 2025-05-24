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
