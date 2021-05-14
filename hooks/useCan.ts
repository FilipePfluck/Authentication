import { useAuth } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions"

type UseCanParams = {
    permissions?: string[]
    roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams){
    const { user, isAuthenticated } = useAuth()

    if(!isAuthenticated){
        return false
    }

    const can = validateUserPermissions({user, permissions, roles})

    return can
}