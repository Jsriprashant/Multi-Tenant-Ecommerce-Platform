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
