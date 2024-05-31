import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

describe("Vaultium", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployVaultium() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const vaultium = await hre.viem.deployContract("Vaultium", [15], {

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

    describe("Create and Get Games", function(){
        describe("Validations", function(){
            it("Should revert with the right error searching games with incomplete data", async function(){
                const { publicClient, vaultium } = await loadFixture(deployVaultium);

                await expect(vaultium.write.createAbandonware(["","","",0, "ES", []])).to.be.rejectedWith(
                    "Invalid name"
                );
                await expect(vaultium.write.createAbandonware(["game","","",0, "ES", []])).to.be.rejectedWith(
                    "Invalid publisher"
                );
                await expect(vaultium.write.createAbandonware(["game","","publisher",0, "ES", []])).to.be.rejectedWith(
                    "Invalid year"
                );
                var hash = await vaultium.write.createAbandonware(["Dune", "","Virgin Games",1992, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                await expect(vaultium.write.createAbandonware(["Dune","","Virgin Games",1992, "ES", []])).to.be.rejectedWith(
                    "Game already exists"
                );

                // first time we search for a game, it does not exist
                await expect(vaultium.read.getAbandonware([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`])).to.be.rejectedWith(
                    "Game does not exist"
                );
            });
        });

        describe("Events and getter", function(){
            it("Should emit an event when when creating a new game", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                // create new abandonware should emit related event
                var hash = await vaultium.write.createAbandonware(["Dune", "","Virgin Games",1992, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                // get the GameAddedToSystem events in the latest block
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                expect(gameAddedEvents[0].args.name).to.equal("Dune");
                const gameHash = gameAddedEvents[0].args.gameHash;

                // get recently added game
                const abandonware = await vaultium.read.getAbandonware([gameHash]);
                await publicClient.waitForTransactionReceipt({ hash });
                expect(abandonware.name).to.equal("Dune");
            });
        });
    });

    describe("Challenges", function(){
        describe("Create challenges Validations", function(){
            it("Should revert with the right error if there is already an existing challenge", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                var hash = await vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                const gameHash = gameAddedEvents[0].args.gameHash;

                const functionResult = await vaultium.read.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                hash = await vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                await publicClient.waitForTransactionReceipt({hash});
                expect(functionResult.gameHash).to.equal(gameHash);
                expect(functionResult.newChallengeVersion.gameVersion.ipfsCid).to.equal("ipfs cid");

                await expect(vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"])).to.be.rejectedWith(
                    "Challenge already existed"
                );
                await expect(vaultium.write.challengeAbandonwareVersion([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`,"ipfs cid","image cid"])).to.be.rejectedWith(
                    "Game not found"
                );
            });
        });

        describe("Vote challenges Validations", function(){
            var _vaultium: any;
            var _publicClient : any;
            var _gameHash : any;

            // before each test, prepare a contract with an game (_gameHash) and a challenge
            this.beforeEach(async function() {
                const {vaultium, publicClient} = await loadFixture(deployVaultium);
                _vaultium = vaultium;
                _publicClient = publicClient;

                var hash = await _vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004, "ES", []]);
                await _publicClient.waitForTransactionReceipt({ hash });

                var gameAddedEvents = await _vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                _gameHash = gameAddedEvents[0].args.gameHash;
            });
            it("Should revert with error if game not found ", async function(){
                await expect(_vaultium.write.voteChallenge([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`,true,1])).to.be.rejectedWith(
                    "Game not found"
                );
            });
            it("Should revert with error if challenge not found ", async function(){
                await expect(_vaultium.write.voteChallenge([_gameHash,true,1])).to.be.rejectedWith(
                    "Challenge not found"
                );
            });
            it("Should revert with error if invalid token count", async function(){
                var hash = await _vaultium.write.challengeAbandonwareVersion([_gameHash!,"ipfs cid","image cid"]);
                await _publicClient.waitForTransactionReceipt({hash});
                await expect(_vaultium.write.voteChallenge([_gameHash,true,0])).to.be.rejectedWith(
                    "You can use between 1 and 10000 tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,10001])).to.be.rejectedWith(
                    "You can use between 1 and 10000 tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,4])).not.to.be.rejectedWith(
                    "You can use between 1 and 10000 tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,10000])).not.to.be.rejectedWith(
                    "You can use between 1 and 10000 tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,3])).to.be.rejectedWith(
                    "You must vote with a square number of tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,18])).to.be.rejectedWith(
                    "You must vote with a square number of tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,4])).not.to.be.rejectedWith(
                    "You must vote with a square number of tokens"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,10000])).not.to.be.rejectedWith(
                    "You must vote with a square number of tokens"
                );
            });
            it("Should revert with error if user has already voted", async function(){
                var hash = await _vaultium.write.challengeAbandonwareVersion([_gameHash!,"ipfs cid","image cid"]);
                await _publicClient.waitForTransactionReceipt({hash});

                await expect(_vaultium.write.voteChallenge([_gameHash,true,4])).not.to.be.rejectedWith(
                    "User has already voted in this challenge"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,true,4])).to.be.rejectedWith(
                    "User has already voted in this challenge"
                );
                await expect(_vaultium.write.voteChallenge([_gameHash,false,4])).to.be.rejectedWith(
                    "User has already voted in this challenge"
                );
            });
            it("Should revert with error if challenge has expired", async function(){
                var hash = await _vaultium.write.challengeAbandonwareVersion([_gameHash!,"ipfs cid","image cid"]);
                await _publicClient.waitForTransactionReceipt({hash});

                await expect(_vaultium.write.voteChallenge([_gameHash,true,1])).not.to.be.rejectedWith(
                    "Challenge not found"
                );
                // wait until challenge is closed
                await delay(15000);
                await expect(_vaultium.write.voteChallenge([_gameHash,true,1])).to.be.rejectedWith(
                    "Challenge not found"
                );
            });
        });

        describe("Get Challenge History Validations", function(){
            it("Should revert if game does not exist", async function(){
                const {vaultium, publicClient} = await loadFixture(deployVaultium);
                await expect(vaultium.read.getGameChallengeHistory([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`])).to.be.rejectedWith(
                    "Game not found"
                );
            });
        });

        describe("Get Challenge History Results", function() {
            it("Should return a the correct list when the game exists", async function(){
                const {vaultium, publicClient} = await loadFixture(deployVaultium);

                var hash = await vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                const gameHash = gameAddedEvents[0].args.gameHash;

                // the history should be empty
                var challengeList = await vaultium.read.getGameChallengeHistory([gameHash!]);
                expect(challengeList).to.have.lengthOf(0);

                // the history should have 1 element after adding a challenge
                hash = await vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                await publicClient.waitForTransactionReceipt({hash});

                challengeList = await vaultium.read.getGameChallengeHistory([gameHash!]);
                expect(challengeList).to.have.lengthOf(1);
            });
        });

        describe("Events", function(){
            it("Should emit an event when a new challenge is added", async function(){
                const { vaultium, publicClient } = await loadFixture(deployVaultium);

                var hash = await vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);

            });

            it("Should emit an event when a new vote is added to a challenge", async function() {
                const {vaultium, publicClient} = await loadFixture(deployVaultium);

                var hash = await vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004, "ES", []]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                const gameHash = gameAddedEvents[0].args.gameHash;

                hash = await vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                await publicClient.waitForTransactionReceipt({hash});
                
                // ok vote
                const voteChallengeResult = await vaultium.read.voteChallenge([gameHash!,true, 9]);
                hash = await vaultium.write.voteChallenge([gameHash!,true, 9]);
                await publicClient.waitForTransactionReceipt({hash});''
                expect(voteChallengeResult.gameHash).to.equal(gameHash);
                expect(voteChallengeResult.newVersionPoints).to.equal(3n);
            });
        });
    });

    describe("Versions", function(){
        describe("Validations", function(){
            it("Revert with error if game does not exist", async function(){
                const {vaultium, publicClient} = await loadFixture(deployVaultium);
                await expect(vaultium.write.getGameVersionHistory([`0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`])).to.be.rejectedWith(
                    "Game not found"
                );
            });
        });
        describe("Get Version History Results", function(){
            it("Should return a the correct list when the game exists", async function(){
                const {vaultium, publicClient} = await loadFixture(deployVaultium);

                var hash = await vaultium.write.createAbandonware(["HarryPotter","Meh","HPublish",2004,"ES",[]]);
                await publicClient.waitForTransactionReceipt({ hash });
                var gameAddedEvents = await vaultium.getEvents.GameAddedToSystem();
                expect(gameAddedEvents).to.have.lengthOf(1);
                const gameHash = gameAddedEvents[0].args.gameHash;

                // the history should be empty
                hash = await vaultium.write.getGameVersionHistory([gameHash!]);
                await publicClient.waitForTransactionReceipt({hash});
                var challengeList = await vaultium.read.getGameVersionHistory([gameHash!]);
                expect(challengeList).to.have.lengthOf(0);

                // create a challenge and make new version win
                hash = await vaultium.write.challengeAbandonwareVersion([gameHash!,"ipfs cid","image cid"]);
                await publicClient.waitForTransactionReceipt({hash});
                hash = await vaultium.write.voteChallenge([gameHash!,true, 9]);
                await publicClient.waitForTransactionReceipt({hash});

                // wait for challenge to close
                await delay(15000);

                hash = await vaultium.write.getGameVersionHistory([gameHash!]);
                await publicClient.waitForTransactionReceipt({hash});
                challengeList = await vaultium.read.getGameVersionHistory([gameHash!]);

                expect(challengeList).to.have.lengthOf(1);
            });
        })
    });
});