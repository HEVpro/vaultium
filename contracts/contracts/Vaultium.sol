// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract Vaultium {
    struct GameInfo {
        string name;
        uint16 year;
        string publisher;
        string ipfsCid;
        bool isAbandonware;
    }

    struct VoteInfo {
        uint32 tokenCount;
        address voterAddress;
    }

    struct VersionVotes {
        VoteInfo[] votes;
    }

    struct GameVersion {
        bytes32 gameHash;
        string ipfsCid;
        VersionVotes upVotes;
        VersionVotes downVotes;
    }

    struct ChallengeVersion {
        GameVersion gameVersion;
        VersionVotes votes;
    }

    struct Challenge {
        bytes32 gameHash;
        ChallengeVersion currentChallengeVersion;
        ChallengeVersion newChallengeVersion;
        uint256 currentVersionPoints;
        uint256 newVersionPoints;
        uint256 creationDate;
        uint256 closingDate;
    }

    struct GameVersionHistory {
        GameVersion[] version;
    }

    struct GameChallengeHistory {
        Challenge[] challenges;
    }  // REVIEW IF OK

    mapping(bytes32 => GameInfo) public games;
    mapping(bytes32 => Challenge) public challenges; // REVIEW IF NAMING OK

    function getGameHash(string memory name, uint16 year, string memory publisher) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, year, publisher));
    }

    // TODO: Maybe change function name? It is not only searching but inserting if not found
    function searchAbandonware(string memory name, string memory description, string memory publisher, uint16 year) public returns (GameInfo memory) { 
        bytes32 gameHash = getGameHash(name, year, publisher);
        GameInfo memory game = games[gameHash];
        if (game.year == 0) {
            games[gameHash] = GameInfo(name, year, publisher, description, true); // TODO: Check if it is abandonware
        }
        return games[gameHash];
    }

}