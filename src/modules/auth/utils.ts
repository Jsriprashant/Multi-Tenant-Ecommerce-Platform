
import { cookies as getCookies } from "next/headers";

interface Props {
    prefix: string,
    value: string
}

export const generateCookies = async ({ prefix, value }: Props) => {
    const cookies = await getCookies();
    cookies.set({
        name: `${prefix}-token`,
        value: value,
        httpOnly: true,
        path: "/",
        // todo: ensure cross domain cookie sharing.
        // so innitial cookie will be generated when we login to funroad.com
        // but if we travel to jp.funroad.com then cookie is not present here and it will be lost 
        // so we need to enable the cross domain cookie sharing
        sameSite: "none",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: process.env.NODE_ENV === "production"

    })
}