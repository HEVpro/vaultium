import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { GameAddedToSystem } from "../generated/Vaultium/Vaultium"

export function createGameAddedToSystemEvent(
  gameHash: Bytes,
  name: string,
  publisher: string,
  year: BigInt,
  country: string,
  genres: Array<i32>
): GameAddedToSystem {
  let gameAddedToSystemEvent = changetype<GameAddedToSystem>(newMockEvent())

  gameAddedToSystemEvent.parameters = new Array()

  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("gameHash", ethereum.Value.fromFixedBytes(gameHash))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromString(publisher))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("year", ethereum.Value.fromUnsignedBigInt(year))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("country", ethereum.Value.fromString(country))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("genres", ethereum.Value.fromI32Array(genres))
  )

  return gameAddedToSystemEvent
}
