import { Navbar } from "./navbar"

interface Props{
    children: React.ReactNode
}

function Layout({children}: Props) {
    return (
        <div>
            <Navbar />
          {children}
        </div>
    )
}

export default Layout
