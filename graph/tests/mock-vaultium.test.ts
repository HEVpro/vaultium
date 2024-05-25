import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"
import { GameAddedToSystem } from "../generated/schema"
import { GameAddedToSystem as GameAddedToSystemEvent } from "../generated/MockVaultium/MockVaultium"
import { handleGameAddedToSystem } from "../src/mock-vaultium"
import { createGameAddedToSystemEvent } from "./mock-vaultium-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameHash = Bytes.fromI32(1234567890)
    let name = "Example string value"
    let genre = 123
    let publisher = "Example string value"
    let year = BigInt.fromI32(234)
    let newGameAddedToSystemEvent = createGameAddedToSystemEvent(
      gameHash,
      name,
      genre,
      publisher,
      year
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
      "genre",
      "123"
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

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
