// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract Vaultium {
    // objects for contract AND ABI
    struct GameInfo {
        string name;
        uint16 year;
        string publisher;
        string ipfsCid;
        string imageCid;
        bool isAbandonware;
        string description;
        bytes32 gameHash;
    }

    struct VoteInfo {
        uint32 tokenCount;
        address voterAddress;
    }

    struct GameVersion {
        bytes32 gameHash;
        string ipfsCid;
        string imageCid;
    }

    // objects for contract
    struct ChallengeVersion {
        GameVersion gameVersion;
        mapping(uint => VoteInfo) votes;
        uint votesSize;
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
        mapping(uint => GameVersion) versions;
        uint versionsSize;
    }

    struct GameChallengeHistory {
        mapping(uint => Challenge) challenges;
        uint challengesSize;
    }

    // objects for ABI (returning objects for operations results)
    struct ChallengeResponse {
        bytes32 gameHash;
        ChallengeVersionResponse currentChallengeVersion;
        ChallengeVersionResponse newChallengeVersion;
        uint256 currentVersionPoints;
        uint256 newVersionPoints;
        uint256 creationDate;
        uint256 closingDate;
    }

    struct ChallengeVersionResponse {
        GameVersion gameVersion;
        VoteInfo[] votes;
    }

    address payable public owner;

    mapping(bytes32 => GameInfo) public game;
    mapping(bytes32 => GameChallengeHistory) public gameChallengeHistory;

    event GameAddedToSystem(bytes32 gameHash, string name, string publisher, uint year);
    event ChallengeAddedToSystem(bytes32 gameHash, string newIpfsCid, string newImageCid);

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
        string calldata _name,
        string calldata _description,
        string calldata _publisher,
        uint16 _year
    ) public returns (GameInfo memory) {
        require(bytes(_name).length > 0, "Invalid name");
        require(bytes(_publisher).length > 0, "Invalid publisher");
        require(_year > 0, "Invalid year");
        bytes32 gameHash = getGameHash(_name, _year, _publisher);
        GameInfo memory gameInfo = GameInfo(_name, _year, _publisher, "", "", true, _description, gameHash);

        if (game[gameHash].year == 0) {
            game[gameHash] = gameInfo;
            emit GameAddedToSystem(gameHash, gameInfo.name, gameInfo.publisher, gameInfo.year);
        }
        
        return gameInfo;
    }

    function hasActiveChallengeForGame(
        bytes32 gameHash
    ) private view returns (bool) {
        if(gameChallengeHistory[gameHash].challengesSize == 0)
            return false;
        uint256 closingDate = gameChallengeHistory[gameHash].challenges[gameChallengeHistory[gameHash].challengesSize - 1].closingDate;
        if(closingDate < block.timestamp)
            return false;
        return true;
    }

    function challengeAbandonwareVersion(
        bytes32 _gameHash, 
        string calldata _ipfsCid,
        string calldata _imageCid
    ) public returns (ChallengeResponse memory){
        require(game[_gameHash].year > 0, "Game not found");
        bool hasActiveChallenge = hasActiveChallengeForGame(_gameHash);
        require(!hasActiveChallenge, "Challenge already existed");

        ChallengeResponse memory newChallenge = ChallengeResponse(
            _gameHash,
            ChallengeVersionResponse(
                GameVersion(_gameHash, game[_gameHash].ipfsCid, game[_gameHash].imageCid),
                new VoteInfo[](0)
            ),
            ChallengeVersionResponse(
                GameVersion(_gameHash, _ipfsCid, _imageCid),
                new VoteInfo[](0)
            ),
            0,
            0,
            block.timestamp,
            block.timestamp + 30 minutes
        );

        // copy new object to storage
        uint lastChallenge = gameChallengeHistory[_gameHash].challengesSize;
        gameChallengeHistory[_gameHash].challengesSize++;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].gameHash = _gameHash;

        gameChallengeHistory[_gameHash].challenges[lastChallenge].currentChallengeVersion.gameVersion = GameVersion(_gameHash, _ipfsCid, _imageCid);
        gameChallengeHistory[_gameHash].challenges[lastChallenge].currentChallengeVersion.votesSize = 0;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].newChallengeVersion.gameVersion = GameVersion(_gameHash, _ipfsCid, _imageCid);
        gameChallengeHistory[_gameHash].challenges[lastChallenge].newChallengeVersion.votesSize = 0;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].closingDate = newChallenge.closingDate;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].creationDate = newChallenge.creationDate;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].currentVersionPoints = newChallenge.currentVersionPoints;
        gameChallengeHistory[_gameHash].challenges[lastChallenge].newVersionPoints = newChallenge.newVersionPoints;

        emit ChallengeAddedToSystem(_gameHash, _ipfsCid, _imageCid);
        return newChallenge;
    }
}
