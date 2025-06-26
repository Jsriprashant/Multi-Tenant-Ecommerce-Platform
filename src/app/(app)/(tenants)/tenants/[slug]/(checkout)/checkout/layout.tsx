
import { Footer } from "@/modules/tenants/ui/components/footer"
import { Navbar } from "@/modules/checkout/ui/components/navbar"

interface Props {
    children: React.ReactNode,
    params: Promise<{ slug: string }>
}

const Layout = async ({ children, params }: Props) => {

    const { slug } = await params;

    return (
        <div className="min-h-screen flex flex-col bg-[#F4F4F0]">
            <Navbar slug={slug} />
            <div className="flex-1">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    {children}
                </div>
            </div>
            <Footer />

        </div>
    )
}

export default Layout