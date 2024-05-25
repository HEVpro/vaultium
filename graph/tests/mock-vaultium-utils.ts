import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  GameAddedToSystem,
  VersionChallengeAccepted,
  VersionChallenged
} from "../generated/MockVaultium/MockVaultium"

export function createGameAddedToSystemEvent(
  gameHash: Bytes,
  name: string,
  genre: i32,
  publisher: string,
  year: BigInt
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
    new ethereum.EventParam(
      "genre",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(genre))
    )
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("publisher", ethereum.Value.fromString(publisher))
  )
  gameAddedToSystemEvent.parameters.push(
    new ethereum.EventParam("year", ethereum.Value.fromUnsignedBigInt(year))
  )

  return gameAddedToSystemEvent
}

export function createVersionChallengeAcceptedEvent(
  gameHash: Bytes,
  ipfsCid: string
): VersionChallengeAccepted {
  let versionChallengeAcceptedEvent = changetype<VersionChallengeAccepted>(
    newMockEvent()
  )

  versionChallengeAcceptedEvent.parameters = new Array()

  versionChallengeAcceptedEvent.parameters.push(
    new ethereum.EventParam("gameHash", ethereum.Value.fromFixedBytes(gameHash))
  )
  versionChallengeAcceptedEvent.parameters.push(
    new ethereum.EventParam("ipfsCid", ethereum.Value.fromString(ipfsCid))
  )

  return versionChallengeAcceptedEvent
}

export function createVersionChallengedEvent(
  gameHash: Bytes,
  ipfsCid: string
): VersionChallenged {
  let versionChallengedEvent = changetype<VersionChallenged>(newMockEvent())

  versionChallengedEvent.parameters = new Array()

  versionChallengedEvent.parameters.push(
    new ethereum.EventParam("gameHash", ethereum.Value.fromFixedBytes(gameHash))
  )
  versionChallengedEvent.parameters.push(
    new ethereum.EventParam("ipfsCid", ethereum.Value.fromString(ipfsCid))
  )

  return versionChallengedEvent
}
