// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarProvider
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NavbarItem {
    href: string,
    children: React.ReactNode,
}
// this interface is used to define the props for the NavbarSidebar component
// in the props interface, we define the items as an array of NavbarItem objects


interface props {
    items: NavbarItem[]
    open: boolean,
    onOpenChange: (open: boolean) => void
}


// export function NavbarSidebar({ items, open, onOpenChange }: props) {
//     return (
//         <Sheet open={open} onOpenChange={onOpenChange}>
//             <SheetContent side="left" className="p-0 transition-none">
//                 <SheetHeader className="p-4 border-b">
//                     <div className="flex items-center">
//                         <SheetTitle >
//                             Menu
//                         </SheetTitle>
//                     </div>

//                 </SheetHeader>
//                 <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
//                     {
//                         items.map((item) => (
//                             <Link className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" key={item.href} href={item.href} onClick={() => { onOpenChange(false) }}> {item.children} </Link>
//                         ))
//                     }
//                     <div className="border-t">
//                         <Link href={"/sign-in"} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={() => { onOpenChange(false) }}>
//                             Log In
//                         </Link>

//                         <Link href={"/sign-up"} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={() => { onOpenChange(false) }}>
//                             Sign Up
//                         </Link>

//                     </div>
//                 </ScrollArea>

//             </SheetContent>

//         </Sheet>
//     )
// }

export function NavbarSidebar({ items, open, onOpenChange }: props) {
    return (

        <SidebarProvider open={open} onOpenChange={onOpenChange}>
            <Sidebar collapsible="offcanvas" side="left" >
                <SidebarHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        Menu
                        <Button variant={'ghost'} onClick={() => { onOpenChange(false) }}>X</Button>
                    </div>
                    

                </SidebarHeader>
                <SidebarContent className="p-0 transition-none">
                    <SidebarGroup className="flex flex-col overflow-y-auto h-full pb-2">
                        {
                            items.map((item) => (
                                <Link className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" key={item.href} href={item.href} onClick={() => { onOpenChange(false) }}> {item.children} </Link>
                            ))
                        }
                    </SidebarGroup>
                    <SidebarGroup>
                        <div className="border-t">
                            <Link href={"/sign-in"} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={() => { onOpenChange(false) }}>
                                Log In
                            </Link>

                            <Link href={"/sign-up"} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={() => { onOpenChange(false) }}>
                                Sign Up
                            </Link>

                        </div>
                    </SidebarGroup>

                </SidebarContent>

            </Sidebar>
        </SidebarProvider>
    )
}


