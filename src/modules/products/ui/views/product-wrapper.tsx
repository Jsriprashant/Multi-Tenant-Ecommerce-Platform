'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ProductView } from '@/modules/products/ui/views/product-view';

interface Props {
    initialProductId: string,
    initialSlug: string,
}

export const ProductWrapper = ({ initialProductId, initialSlug }: Props) => {
    const params = useParams();
    const router = useRouter();
    const prevParamsRef = useRef({ productId: initialProductId, slug: initialSlug });

    useEffect(() => {
        const current = { productId: params.productId as string, slug: params.slug as string };
        if (current.productId !== prevParamsRef.current.productId || current.slug !== prevParamsRef.current.slug) {
            router.refresh();  // Forces fresh RSC fetch, TRPC execution, and re-render
            prevParamsRef.current = current;
        }
    }, [params.productId, params.slug, router]);

    return <ProductView productId={params.productId as string} tenantSlug={params.slug as string} />;
};