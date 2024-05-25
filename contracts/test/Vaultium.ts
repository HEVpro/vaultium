import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";


describe("Valtium", function () {
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
            it("Should evert with the right error if no games exist for a search", async function(){
                const { vaultium } = await loadFixture(deployVaultium);

                await expect(vaultium.write.searchAbandonware(["","","",0])).to.be.rejectedWith(
                  "No valid games found"
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

    describe("Lilypad", function(){

    });
});