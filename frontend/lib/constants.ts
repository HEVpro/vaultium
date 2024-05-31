
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

        name: 'genre',
        type: 'uint8',
    },
    {

        name: 'publisher',
        type: 'string',
    },
    {

        name: 'year',
        type: 'uint256',
    },
]

const subgraphName = 'vaultium-sepolia'
const graphId = '62919'
export const graphUrl = `https://api.studio.thegraph.com/query/${graphId}/${subgraphName}/version/latest`