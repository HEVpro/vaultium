import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"
import { GameAddedToSystem } from "../generated/schema"
import { GameAddedToSystem as GameAddedToSystemEvent } from "../generated/Vaultium/Vaultium"
import { handleGameAddedToSystem } from "../src/vaultium"
import { createGameAddedToSystemEvent } from "./vaultium-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameHash = Bytes.fromI32(1234567890)
    let name = "Example string value"
    let publisher = "Example string value"
    let year = BigInt.fromI32(234)
    let country = "Example string value"
    let genres = [123]
    let newGameAddedToSystemEvent = createGameAddedToSystemEvent(
      gameHash,
      name,
      publisher,
      year,
      country,
      genres
    )
    handleGameAddedToSystem(newGameAddedToSystemEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GameAddedToSystem created and stored", () => {
    assert.entityCount("GameAddedToSystem", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameHash",
      "1234567890"
    )
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "publisher",
      "Example string value"
    )
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "year",
      "234"
    )
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "country",
      "Example string value"
    )
    assert.fieldEquals(
      "GameAddedToSystem",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "genres",
      "[123]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
