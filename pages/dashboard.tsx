import { useAuth } from "../contexts/AuthContext"

export default function Dashboard(){
    const { user } = useAuth()

    return(
        <h1>Dashboard: {user?.email}</h1>
    )
}