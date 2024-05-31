import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { graphUrl } from '@/lib/constants'
import { Game } from './types'

export const graphClient = new ApolloClient({
    uri: graphUrl,
    cache: new InMemoryCache(),
})

export const getGames = async (): Promise<Game[]> => {
    const tokensQuery = gql`
        query {
            gameAddedToSystems {
                genres
                name
                publisher
                year
                gameHash
                country
            }
        }
    `
    const gameHashes = await graphClient
        .query({
            query: tokensQuery,
        })
        .then((data) => {
            return data.data.gameAddedToSystems.map((item: any) => ({
                genres: item.genres,
                name: item.name,
                publisher: item.publisher,
                year: item.year,
                gameHash: item.gameHash,
                country: item.country,
            }))
        })
        .catch((err) => {
            console.error('Error fetching data: ', err)
        })
    return gameHashes
}
