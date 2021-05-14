import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import decode from 'jwt-decode'

import { AuthTokenError } from "../services/errors/AuthTokenError"
import { validateUserPermissions } from "./validateUserPermissions"
import { redirect } from "next/dist/next-server/server/api-utils"

type WithSSROptions = {
    permissions?: string[]
    roles?: string[]
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSROptions ){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx)

        const token = cookies['nextauth.token']

        if(!token){
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        if(options){
            const { permissions, roles } = options
            const user = decode<{permissions: string[], roles: string[]}>(token)

            const can = validateUserPermissions({user, permissions, roles})

            if(!can){
                return {
                    redirect: {
                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }
        }

        try{
            return await fn(ctx)
        }catch(error){
            if(error instanceof AuthTokenError){
                destroyCookie(ctx, 'nextauth.token')
                destroyCookie(ctx, 'nextauth.refreshToken')

                return {
                    redirect: {
                    destination: '/',
                    permanent: false
                    }
                }
            }

            
        }
    }
}