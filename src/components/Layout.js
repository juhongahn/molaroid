import Navbar from "./Navbar"
import { useRouter } from "next/router"

export default function Layout({ children }) {
    const router = useRouter()
    return (
        <>
            { router.pathname !== '/'? <Navbar />:''}
            {children}
        </>
    )
}