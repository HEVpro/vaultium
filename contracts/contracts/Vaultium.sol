// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract Vaultium {
    struct GameInfo {
        string name;
        uint16 year;
        string publisher;
        string ipfsCid;
        bool isAbandonware;
        string description;
        bytes32 gameHash;
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
        Challenge[] challenge;
    }

    address payable public owner;

    mapping(bytes32 => GameInfo) public game;
    mapping(bytes32 => Challenge) public challenge;

    event GameAddedToSystem(bytes32 gameHash, string name, string publisher, uint year);

    constructor() {
        owner = payable(msg.sender);
    }

    function getGameHash(
        string memory _name,
        uint16 _year,
        string memory _publisher
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _year, _publisher));
    }

    // TODO: Maybe change function name? It is not only searching but inserting if not found
    function searchAbandonware(
        string memory _name,
        string memory _description,
        string memory _publisher,
        uint16 _year
    ) public returns (GameInfo memory) {
        require(bytes(_name).length > 0, "Invalid name");
        require(bytes(_publisher).length > 0, "Invalid publisher");
        require(_year > 0, "Invalid year");
        bytes32 gameHash = getGameHash(_name, _year, _publisher);
        GameInfo memory gameInfo = GameInfo(_name, _year, _publisher, "", true, _description, gameHash);
        
        if (game[gameHash].year == 0) {
            game[gameHash] = gameInfo;
            emit GameAddedToSystem(gameHash, gameInfo.name, gameInfo.publisher, gameInfo.year);
        }
        
        return gameInfo;
    }
}
