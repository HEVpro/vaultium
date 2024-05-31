// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract Vaultium {
    enum Genre {
        Action,
        Adventure,
        Fighting,
        Platform,
        Puzzle,
        Racing,
        RolePlaying,
        Shooter,
        Simulation,
        Sports,
        Strategy,
        Other
    }
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
        string country;
        Genre[] genres;
    }

    struct VoteInfo {
        uint32 pointsCount;
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

    mapping(bytes32 => GameInfo) private game;
    mapping(bytes32 => GameChallengeHistory) private gameChallengeHistory;
    mapping(bytes32 => GameVersionHistory) private gameVersionHistory;

    uint256 challengeTime; // seconds until challenges close

    event GameAddedToSystem(bytes32 gameHash, string name, string publisher, uint year, string country, Genre[] genres);
    event ChallengeAddedToSystem(bytes32 gameHash, string newIpfsCid, string newImageCid);
    event VotedChallenge(bytes32 gameHash, ChallengeResponse challenge);
    event ClosedChallenge(bytes32 gameHash, ChallengeResponse challenge);

    constructor(uint256 _challengeTime) {
        owner = payable(msg.sender);
        challengeTime = _challengeTime;
    }

    function getGameHash(
        string memory _name,
        uint16 _year,
        string memory _publisher
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _year, _publisher));
    }
    
    function createAbandonware(
        string calldata _name,
        string calldata _description,
        string calldata _publisher,
        uint16 _year,
        string calldata _country,
        Genre[] calldata _genres
    ) public returns (GameInfo memory) {
        require(bytes(_name).length > 0, "Invalid name");
        require(bytes(_publisher).length > 0, "Invalid publisher");
        require(_year > 0, "Invalid year");
        bytes32 gameHash = getGameHash(_name, _year, _publisher);
        require(game[gameHash].year == 0, "Game already exists");

        GameInfo memory gameInfo = GameInfo(_name, _year, _publisher, "", "", true, _description, gameHash, _country, _genres);

        game[gameHash] = gameInfo;
        emit GameAddedToSystem(gameHash, gameInfo.name, gameInfo.publisher, gameInfo.year, gameInfo.country, gameInfo.genres);
        
        return gameInfo;
    }

    function getAbandonware(bytes32 _gameHash) public view returns (GameInfo memory){
        require(game[_gameHash].year != 0, "Game does not exist");
        GameInfo memory gameInfo = GameInfo(
            game[_gameHash].name, 
            game[_gameHash].year, 
            game[_gameHash].publisher, 
            game[_gameHash].ipfsCid, 
            game[_gameHash].imageCid, 
            game[_gameHash].isAbandonware, 
            game[_gameHash].description, 
            game[_gameHash].gameHash,
            game[_gameHash].country,
            game[_gameHash].genres
        );

        bool hasLastChallenge = gameChallengeHistory[_gameHash].challengesSize > 0;
        if(!hasLastChallenge)
            return gameInfo;
        bool lastChallengeIsOngoing = 
            gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].closingDate > block.timestamp;
        if(lastChallengeIsOngoing)
            return gameInfo;
            
        // last challenge is closed, we should (just in case, update our gameInfo)
        if(gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentVersionPoints <
            gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newVersionPoints){
            // new version is the right one
            gameInfo.ipfsCid = gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.ipfsCid;
            gameInfo.imageCid = gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.imageCid;

        } else {
            // current version is the right one
            gameInfo.ipfsCid = gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.ipfsCid;
            gameInfo.imageCid = gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.imageCid;
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

        closeChallengesIfNeeded(_gameHash);

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
            block.timestamp + challengeTime
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

    function hasUserVotedChallenge(bytes32 gameHash, address userAddr) private view returns (bool){
        // new version
        uint newVersionSize = gameChallengeHistory[gameHash]
                .challenges[gameChallengeHistory[gameHash].challengesSize - 1]
                .newChallengeVersion.votesSize;
        
        for (uint i = 0; i < newVersionSize; i++) {
            if(gameChallengeHistory[gameHash]
                .challenges[gameChallengeHistory[gameHash].challengesSize - 1]
                .newChallengeVersion.votes[i].voterAddress == userAddr)
                return true;
        }

        // current version
        uint currentVersionSize = gameChallengeHistory[gameHash]
                .challenges[gameChallengeHistory[gameHash].challengesSize - 1]
                .currentChallengeVersion.votesSize;
        
        for (uint i = 0; i < currentVersionSize; i++) {
            if(gameChallengeHistory[gameHash]
                .challenges[gameChallengeHistory[gameHash].challengesSize - 1]
                .currentChallengeVersion.votes[i].voterAddress == userAddr)
                return true;
        }

        // not found in any version
        return false;
    }

    function getSquareRoot(uint32 n) private pure returns (uint32){
        for(uint32 i = 1; i*i <= n; i++){
            if(i*i == n)
                return i;
        }
        return 0;
    }

    function isSquare(uint32 n) private pure returns (bool){
        return (getSquareRoot(n) > 0);
    }

    function getChallengeResponse(bytes32 _gameHash, uint challengeIndex) private view returns (ChallengeResponse memory) {
        VoteInfo[] memory currentVotes = new VoteInfo[](gameChallengeHistory[_gameHash]
                .challenges[challengeIndex]
                .currentChallengeVersion.votesSize);
        for(uint i = 0; i < currentVotes.length; i++){
            currentVotes[i] = gameChallengeHistory[_gameHash].challenges[challengeIndex]
                .currentChallengeVersion.votes[i];
        }

        VoteInfo[] memory newVotes = new VoteInfo[](gameChallengeHistory[_gameHash]
                .challenges[challengeIndex]
                .newChallengeVersion.votesSize);
        for(uint i = 0; i < newVotes.length; i++){
            newVotes[i] = gameChallengeHistory[_gameHash].challenges[challengeIndex]
                .newChallengeVersion.votes[i];
        }


        ChallengeResponse memory newChallenge = ChallengeResponse(
            _gameHash,
            ChallengeVersionResponse(
                GameVersion(_gameHash, game[_gameHash].ipfsCid, game[_gameHash].imageCid),
                currentVotes
            ),
            ChallengeVersionResponse(
                GameVersion(
                    _gameHash, 
                    gameChallengeHistory[_gameHash].challenges[challengeIndex].newChallengeVersion.gameVersion.ipfsCid, 
                    gameChallengeHistory[_gameHash].challenges[challengeIndex].newChallengeVersion.gameVersion.imageCid),
                newVotes
            ),
            gameChallengeHistory[_gameHash].challenges[challengeIndex].currentVersionPoints,
            gameChallengeHistory[_gameHash].challenges[challengeIndex].newVersionPoints,
            gameChallengeHistory[_gameHash].challenges[challengeIndex].creationDate,
            gameChallengeHistory[_gameHash].challenges[challengeIndex].closingDate
        );
        return newChallenge;
    }

    function voteChallenge(bytes32 _gameHash, bool _voteNewVersion, uint32 _tokenCount) public returns (ChallengeResponse memory){
        require(game[_gameHash].year > 0, "Game not found");
        bool hasActiveChallenge = hasActiveChallengeForGame(_gameHash);
        require(hasActiveChallenge, "Challenge not found");
        require(_tokenCount > 0 && _tokenCount <= 10000, "You can use between 1 and 10000 tokens");
        require(isSquare(_tokenCount), "You must vote with a square number of tokens");
        require(!hasUserVotedChallenge(_gameHash, msg.sender), "User has already voted in this challenge");

        uint32 newPoints = getSquareRoot(_tokenCount);

        // add new vote and recalc quadratic score
        if(_voteNewVersion){
            // add vote
            uint newIndex = gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .newChallengeVersion.votesSize;
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .newChallengeVersion.votesSize++;
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .newChallengeVersion.votes[newIndex] = VoteInfo(newPoints, msg.sender);

            // recalculate voteSum
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .newVersionPoints += newPoints;
        } else {
            // add vote
            uint newIndex = gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .currentChallengeVersion.votesSize;
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .currentChallengeVersion.votesSize++;
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .currentChallengeVersion.votes[newIndex] = VoteInfo(newPoints, msg.sender);

            // recalculate voteSum
            gameChallengeHistory[_gameHash]
                .challenges[gameChallengeHistory[_gameHash].challengesSize - 1]
                .currentVersionPoints += newPoints;
        }
        ChallengeResponse memory response =  getChallengeResponse(_gameHash, gameChallengeHistory[_gameHash].challengesSize - 1);
        emit VotedChallenge(_gameHash, response);
        return response;
    }

    function getGameChallengeHistory(bytes32 _gameHash) public view returns (ChallengeResponse[] memory) {
        require(game[_gameHash].year > 0, "Game not found");

        uint listSize = gameChallengeHistory[_gameHash].challengesSize;
        ChallengeResponse[] memory response = new ChallengeResponse[](listSize);

        for(uint i = 0; i < listSize; i++){
            response[i] = getChallengeResponse(_gameHash, i);
        }
        
        return response;
    }

    function getGameVersionHistory(bytes32 _gameHash) public view returns (GameVersion[] memory) {
        require(game[_gameHash].year > 0, "Game not found");

        uint listSize = gameVersionHistory[_gameHash].versionsSize;

        bool hasLastChallenge = gameChallengeHistory[_gameHash].challengesSize > 0;
        bool lastChallengeIsOngoing = false;
        if(hasLastChallenge) lastChallengeIsOngoing = 
            gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].closingDate > block.timestamp;

        bool versionHistoryMissesLastChallenge = false;
        if(hasLastChallenge && !lastChallengeIsOngoing){
            // check if last version in version history is the same as last challenge winner
            if(gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentVersionPoints <
                gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newVersionPoints){
                // new version is the right one
                bool hasLastVersionInHistory = gameVersionHistory[_gameHash].versionsSize > 0;

                bool sameIpfs = hasLastVersionInHistory && stringsEquals(gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize - 1].ipfsCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.ipfsCid);
                bool sameImage= hasLastVersionInHistory && stringsEquals(gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize - 1].imageCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.imageCid);
                // misses if objects are differents
                versionHistoryMissesLastChallenge = !(sameIpfs && sameImage);
            } else {
                // current version is the right one
                bool hasLastVersionInHistory = gameVersionHistory[_gameHash].versionsSize > 0;

                bool sameIpfs = hasLastVersionInHistory && stringsEquals(gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize - 1].ipfsCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.ipfsCid);
                bool sameImage= hasLastVersionInHistory && stringsEquals(gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize - 1].imageCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.imageCid);

                versionHistoryMissesLastChallenge = !(sameIpfs && sameImage);
            }
        }

        if(versionHistoryMissesLastChallenge)
            listSize++;
        GameVersion[] memory response = new GameVersion[](listSize);

        for(uint i = 0; i < gameVersionHistory[_gameHash].versionsSize; i++){
            response[i] = gameVersionHistory[_gameHash].versions[i];
        }

        if(versionHistoryMissesLastChallenge){
            // add version to last response position
            if(gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentVersionPoints <
                gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newVersionPoints){
                // new version is the right one
                response[listSize-1] = GameVersion(_gameHash, 
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.ipfsCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.imageCid);
            } else {
                // current version is the right one
                response[listSize-1] = GameVersion(_gameHash, 
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.ipfsCid,
                    gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentChallengeVersion.gameVersion.imageCid);
            }
        }

        
        return response;
    }

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;
        for (uint256 i=0; i<l1; i++) {
            if (b1[i] != b2[i]) return false;
        }
        return true;
    }

    // closing a challenges may insert a new entry to version history
    function closeChallengesIfNeeded(bytes32 _gameHash) public {
        bool hasLastChallenge = gameChallengeHistory[_gameHash].challengesSize > 0;
        if(!hasLastChallenge)
            return;
        bool lastChallengeIsOngoing = 
            gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].closingDate > block.timestamp;
        if(lastChallengeIsOngoing)
            return;
        bool lastChallengeHadToChangeVersion = 
            (
                gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newVersionPoints > 
                gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].currentVersionPoints
            );
        if(!lastChallengeHadToChangeVersion)
            return;

        string memory newVersionIpfsCid = (gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.ipfsCid);
        string memory newVersionImageCid = (gameChallengeHistory[_gameHash].challenges[gameChallengeHistory[_gameHash].challengesSize - 1].newChallengeVersion.gameVersion.imageCid);
        bool doWeHaveLastVersion = false;
        if(gameVersionHistory[_gameHash].versionsSize > 0){
            doWeHaveLastVersion = 
                stringsEquals(
                    (gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize -1].ipfsCid), 
                    newVersionIpfsCid)
                &&
                stringsEquals(
                    (gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize -1].imageCid), 
                    newVersionImageCid);
        }
        if(doWeHaveLastVersion)
            return;
        
        // If we get here, we have a valid last challenge that doesn't have its last version saved
        gameVersionHistory[_gameHash].versionsSize++;
        gameVersionHistory[_gameHash].versions[gameVersionHistory[_gameHash].versionsSize -1] = GameVersion(_gameHash, newVersionIpfsCid, newVersionImageCid);
        game[_gameHash].ipfsCid = newVersionIpfsCid;
        game[_gameHash].imageCid = newVersionImageCid;

        ChallengeResponse memory response =  getChallengeResponse(_gameHash, gameChallengeHistory[_gameHash].challengesSize - 1);
        emit ClosedChallenge(_gameHash, response);
    }
}