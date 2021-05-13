import { createContext, useContext, useEffect, useState } from 'react'
import Router, { useRouter} from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from '../services/api'

type Credentials = {
    email: string
    password: string
}

type AuthContextData = {
    signIn(credentials: Credentials): Promise<void>
    isAuthenticated: boolean
    user: User
}

type User = {
    email: string
    permissions: string[]
    roles: string[]
}

const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    Router.push('/')
}

export function AuthProvider({children}){
    const { push } = useRouter()

    const [user, setUser] = useState<User>()

    const isAuthenticated = !!user

    async function signIn({email, password}: Credentials){
        try{
            const response = await api.post('sessions', {
                email,
                password
            })

            const { permissions, roles, token, refreshToken } = response.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            setUser({
                email,
                permissions,
                roles
            })


            api.defaults.headers['Authorization'] = `Bearer ${token}`

            push('/dashboard')
        }catch(error){
            console.log(error)
        }
    }
    
    useEffect(()=>{
        const { 'nextauth.token': token }= parseCookies()

        if(token) {
            api.get('/me').then(response => {
                const { email, permissions, roles} = response.data

                setUser({
                    email,
                    permissions,
                    roles
                })
            }).catch(() => {
                signOut()
            })
        }
    },[])

    return(
        <AuthContext.Provider value={{signIn,isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {return useContext(AuthContext)}