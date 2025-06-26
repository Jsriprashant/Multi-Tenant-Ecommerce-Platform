import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view"

interface props {
    params: Promise<{ slug: string }>

}

const page = async ({ params }: props) => {

    const { slug } = await params

    return (
        <div>
            <CheckoutView tenantSlug={slug} />
        </div>
    )
}

export default page