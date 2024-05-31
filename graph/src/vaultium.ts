import { GameAddedToSystem as GameAddedToSystemEvent } from "../generated/Vaultium/Vaultium"
import { GameAddedToSystem } from "../generated/schema"

export function handleGameAddedToSystem(event: GameAddedToSystemEvent): void {
  let entity = new GameAddedToSystem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gameHash = event.params.gameHash
  entity.name = event.params.name
  entity.publisher = event.params.publisher
  entity.year = event.params.year
  entity.country = event.params.country
  entity.genres = event.params.genres

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
