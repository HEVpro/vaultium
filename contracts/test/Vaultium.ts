import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";


describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployVaultium() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const vaultium = await hre.viem.deployContract("Vaultium", [], {

        });

        const publicClient = await hre.viem.getPublicClient();

        return {
            vaultium,
            owner,
            otherAccount,
            publicClient,
        };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { vaultium, owner } = await loadFixture(deployVaultium);

            expect(await vaultium.read.owner()).to.equal(
                getAddress(owner.account.address)
            );
        });
    });

    describe("Searching Games", function(){
        describe("Validations", function(){
            it("Should revert with the right error searching games with incomplete data", async function(){
                const { vaultium } = await loadFixture(deployVaultium);

                await expect(vaultium.write.searchAbandonware(["","","",0])).to.be.rejectedWith(
                    "Invalid name"
                );
                await expect(vaultium.write.searchAbandonware(["game","","",0])).to.be.rejectedWith(
                    "Invalid publisher"
                );
                await expect(vaultium.write.searchAbandonware(["game","","publisher",0])).to.be.rejectedWith(
                    "Invalid year"
                );
            });
        });

        describe("Events", function(){
            it("Should emit an event when (and only when) finding a new game", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                // first time we search for a game, it is hashed and stored on the contract
                var hash = await vaultium.write.searchAbandonware(["Dune", "","Virgin Games",1992]);
                await publicClient.waitForTransactionReceipt({ hash });
                
                // get the GameAddedToSystem events in the latest block
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                expect(gameAddedEvents[0].args.name).to.equal("Dune");

                // second time we search for a game, it already exists on the system
                hash = await vaultium.write.searchAbandonware(["Dune", "","Virgin Games",1992]);
                await publicClient.waitForTransactionReceipt({ hash });

                // get the GameAddedToSystem events in the latest block
                gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(0);
            });
        });
    });

    describe("Create Challenges", function(){
        describe("Validations", function(){
            it("Should revert with the right error if there is already an existing challenge", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                var hash = await vaultium.write.searchAbandonware(["HarryPotter","Meh","HPublish",2004]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                const gameHash = gameAddedEvents[0].args.gameHash;

                hash = await vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                await publicClient.waitForTransactionReceipt({hash});
                var challengeAddedEvents = await vaultium.getEvents.ChallengeAddedToSystem();
                expect(challengeAddedEvents).to.have.lengthOf(1);

                await expect(vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"])).to.be.rejectedWith(
                    "Challenge already existed"
                );
                await expect(vaultium.write.challengeAbandonwareVersion([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`,"ipfs cid","image cid"])).to.be.rejectedWith(
                    "Game not found"
                );
            });
        });

        describe("Events", function(){
            it("Should emit an event when a new challenge is added", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                var hash = await vaultium.write.searchAbandonware(["HarryPotter","Meh","HPublish",2004]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);

            });
        });
    })
});