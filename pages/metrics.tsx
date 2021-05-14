import { useAuth } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"

import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard(){
  return(
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/me')
    console.log(response)

    return {
      props: {
        
      }
    }
  }, {
      permissions: ['metrics.list'],
      roles: ['administrator']
  })