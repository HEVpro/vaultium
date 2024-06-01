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
    }
]

const subgraphName = 'vaultium-sepolia-2'
const graphId = '62919'
export const graphUrl = `https://api.studio.thegraph.com/query/${graphId}/${subgraphName}/version/latest`

export const contractAddress = '0x60e097484cd0222a62057ebce6099913f77f8ed2'

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
