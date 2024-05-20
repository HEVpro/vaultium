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

    mapping(bytes32 => GameInfo) public game;
    mapping(bytes32 => Challenge) public challenge;

    function getGameHash(
        string memory _name,
        uint16 _year,
        string memory _publisher
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _year, _publisher));
    }

    function validateGameInfo(
        GameInfo memory _gameInfo
    ) private pure returns (bool) {
        if (
            !(_gameInfo.year > 1822) ||
            bytes(_gameInfo.name).length == 0 ||
            bytes(_gameInfo.publisher).length == 0
        ) {
            return false;
        }
        return true;
    }

    function fillGameInfo(
        GameInfo memory _gameInfo
    ) private pure returns (GameInfo[] memory) {
        GameInfo[] memory gameInfo = new GameInfo[](1);
        gameInfo[0] = _gameInfo;
        
        return filterValidGames(gameInfo);
    }

    /**
     * @dev Given an array of games, it returns a new array with only the valid games
     * @param gameInfo An array of GameInfo structs
     * @return GameInfo An array of GameInfo structs with only the valid games
     */

    function filterValidGames(
        GameInfo[] memory gameInfo
    ) private pure returns (GameInfo[] memory) {
        bool[] memory validGames = new bool[](gameInfo.length);
        uint256 validGamesCount = 0;
        for (uint256 i = 0; i < gameInfo.length; i++) {
            validGames[i] = validateGameInfo(gameInfo[i]);
            if (validGames[i]) {
                validGamesCount++;
            }
        }
        GameInfo[] memory validGamesResult = new GameInfo[](validGamesCount);
        uint256 validGamesIndex = 0;
        for (uint256 i = 0; i < gameInfo.length; i++) {
            if (validGames[i]) {
                validGamesResult[validGamesIndex] = gameInfo[i];
                validGamesIndex++;
            }
        }
        return validGamesResult;
    }

    // TODO: Maybe change function name? It is not only searching but inserting if not found
    function searchAbandonware(
        string memory _name,
        string memory _description,
        string memory _publisher,
        uint16 _year
    ) public returns (GameInfo[] memory) {
        GameInfo[] memory gameInfo = fillGameInfo(
            GameInfo(_name, _year, _publisher, "", true, _description)
        );
        require(gameInfo.length > 0, "No valid games found.");
        for (uint256 i = 0; i < gameInfo.length; i++) {
            bytes32 gameHash = getGameHash(
                gameInfo[i].name,
                gameInfo[i].year,
                gameInfo[i].publisher
            );
            if (game[gameHash].year == 0) {
                game[gameHash] = gameInfo[i];
            } else {
                gameInfo[i] = game[gameHash];
            }
        }
        return gameInfo;
    }
}
