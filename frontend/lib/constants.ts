import { Abandonware } from "./types"
import { generateRandomSHA256 } from "./utils"

export const gameCasterArray = [
    {
        name: 'gameHash',
        type: 'bytes32',
    },
    {
        name: 'name',
        type: 'string',
    },
    {
        name: 'publisher',
        type: 'string',
    },
    {
        name: 'year',
        type: 'uint256',
    },
    {
        name: 'country',
        type: 'string',
    },
    {
        name: 'genres',
        type: 'uint8[]',
    },
]

const subgraphName = 'vaultium-final-hackfs'
const graphId = '62919'
export const graphUrl = `https://api.studio.thegraph.com/query/${graphId}/${subgraphName}/version/latest`

export const contractAddress = '0x7917493b0ed30085a7aE83ef0bD42bBB5F0Ca49E'

export const genres = [
    'Action',
    'Adventure',
    'Fighting',
    'Platform',
    'Puzzle',
    'Racing',
    'RolePlaying',
    'Shooter',
    'Simulation',
    'Sports',
    'Strategy',
]

export const gameExample = {
    gameHash: generateRandomSHA256(),
    name: 'Super Mario Bros. 3',
    genres: [1],
    publisher: 'Nintendo',
    year: 1990,
    country: 'USA',
    description: '',
    ipfsCid: '',
}
