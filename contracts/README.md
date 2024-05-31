# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

# Contract deployment

A mock contract has been deployed on this address: [0xE8B07e948168108C8f0BE3bfD448D4a9A9B56596](https://sepolia.etherscan.io/address/0xe8b07e948168108c8f0be3bfd448d4a9a9b56596) - Only for front-end development purposes

The current last version of the contract is deployed on this address: [0xB62A6639D89C91b8B04B58c1ecdb4aC6E4399746](https://sepolia.etherscan.io/address/0xB62A6639D89C91b8B04B58c1ecdb4aC6E4399746)





# Contract specs for Vaultium

## Responsabilities
- Validate if a game is abandonware
- Autocomplete information about the game that the user may not know
- Given a small amount of info, find the game in the system

## Structs

- GameInfo
    - name                      : string
    - year                      : uint16
    - publisher                 : string
    - ipfsCid                   : string
    - isAbandonware             : bool

- VoteInfo
    - tokenCount                : uint32
    - voterAddress              : address

- VersionVotes
    - voteInfo                  : VoteInfo[]

- GameVersion
    - gameHash                  : bytes32
    - ipfsCid                   : string
    - upVotes                   : VersionVotes
    - downVotes                 : VersionVotes

- ChallengeVersion
    - gameVersion               : GameVersion
    - votes                     : VersionVotes

- Challenge
    - gameHash                  : bytes32
    - currentChallengeVersion   : ChallengeVersion
    - newChallengeVersion       : ChallengeVersion
    - currentVersionPoints      : uint256
    - newVersionPoints          : uint256
    - creationDate              : uint256
    - closingDate               : uint256

- GameVersionHistory
    - version                   : GameVersion[]

- GameChallengeHistory           
    - challenge                 : Challenge[]

## Contract's data

- game                          : mapping(bytes32 => GameInfo)
- challenge                     : mapping(bytes32 => Challenge)

// decide if we are storing this or if we store history somewhere else
- gameVersionHistory            : mapping(bytes32 => GameVersionHistory)
- gameChallengeHistory          : mapping(bytes32 => GameChallengeHistory)

## Functions

### Private
- `getGameHash(string name, string publisher, uint16 year) : bytes32`
- `calculatePoints(VersionVotes votes) : uint256`
- `closeChallenges() : void`

### Public
- `searchAbandonware(string name, string description, string publisher, uint16 year) : GameInfo[]`
    - creates a new entry for the games that didn't exist in the contract

- `challengeAbandonwareVersion(bytes32 gameHash, string ipfsCid) : Challenge`
    - reverts if the game for the gameHash is not found or is not abandonware
    - reverts if there is already an existing challenge for the game with gameHash
    - creates a new challenge for the game with gameHash

- `voteChallenge(bytes32 gameHash, bool voteNewVersion, uint32 tokenCount): Challenge`
    - reverts if there is no active challenge for the gameHash (for last challenge, time > closingDate)
    - reverts if user doesn't have enough tokens
    - challenge results will be calculated by a quadratic formula (similar to quadratic funding)

- `getGameChallengeHistory(bytes32 gameHash) : GameChallengeHistory`
    - it returns an array with all related challenges for the game
    - reverts if the game doesn't exist

- `getGameVersionHistory(bytes32 gameHash) : GameVersionHistory`
    - it returns an array with the history of all game versions
    - reverts if the game doesn't exist