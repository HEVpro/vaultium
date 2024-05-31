import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { graphUrl } from '@/lib/constants'

export const graphClient = new ApolloClient({
    uri: graphUrl,
    cache: new InMemoryCache(),
})
