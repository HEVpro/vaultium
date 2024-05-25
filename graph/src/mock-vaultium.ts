import {
  GameAddedToSystem as GameAddedToSystemEvent,
  VersionChallengeAccepted as VersionChallengeAcceptedEvent,
  VersionChallenged as VersionChallengedEvent
} from "../generated/MockVaultium/MockVaultium"
import {
  GameAddedToSystem,
  VersionChallengeAccepted,
  VersionChallenged
} from "../generated/schema"

export function handleGameAddedToSystem(event: GameAddedToSystemEvent): void {
  let entity = new GameAddedToSystem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameHash = event.params.gameHash
  entity.name = event.params.name
  entity.genre = event.params.genre
  entity.publisher = event.params.publisher
  entity.year = event.params.year

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVersionChallengeAccepted(
  event: VersionChallengeAcceptedEvent
): void {
  let entity = new VersionChallengeAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameHash = event.params.gameHash
  entity.ipfsCid = event.params.ipfsCid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVersionChallenged(event: VersionChallengedEvent): void {
  let entity = new VersionChallenged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameHash = event.params.gameHash
  entity.ipfsCid = event.params.ipfsCid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
