// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./ILilypadJobManager.sol";
import "./ILilypadJobClient.sol";

contract Vaultium is Ownable, Initializable, ILilypadJobClient {
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

    //address payable public owner;
    mapping(bytes32 => GameInfo) public game;
    mapping(bytes32 => Challenge) public challenge;

    event GameAddedToSystem(
        bytes32 gameHash,
        string name,
        string publisher,
        uint year
    );

    function initialize(address _jobManagerAddress) public initializer {
        setJobManagerAddress(_jobManagerAddress);
    }

    // constructor() {
    //     owner = payable(msg.sender);
    // }

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
        if (
            _gameInfo.gameHash !=
            getGameHash(_gameInfo.name, _gameInfo.year, _gameInfo.publisher)
        ) {
            return false;
        }
        return true;
    }

    function getAutofilledGamesForUserInput(
        GameInfo memory _userInputGameInfo
    ) private pure returns (GameInfo[] memory) {
        // TODO: call Lilypad to get an array of GameInfo
        GameInfo[] memory gameInfo = new GameInfo[](1);
        gameInfo[0] = _userInputGameInfo;

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
        GameInfo[] memory gameInfo = getAutofilledGamesForUserInput(
            GameInfo(
                _name,
                _year,
                _publisher,
                "",
                true,
                _description,
                getGameHash(_name, _year, _publisher)
            )
        );
        require(gameInfo.length > 0, "No valid games found");
        for (uint256 i = 0; i < gameInfo.length; i++) {
            bytes32 gameHash = getGameHash(
                gameInfo[i].name,
                gameInfo[i].year,
                gameInfo[i].publisher
            );
            if (game[gameHash].year == 0) {
                game[gameHash] = gameInfo[i];
                emit GameAddedToSystem(
                    gameInfo[i].gameHash,
                    gameInfo[i].name,
                    gameInfo[i].publisher,
                    gameInfo[i].year
                );
            } else {
                gameInfo[i] = game[gameHash];
            }
        }
        return gameInfo;
    }

    // Lilypad
    address private jobManagerAddress;
    ILilypadJobManager private jobManagerContract;
    mapping(uint256 => string) private jobResults;

    event JobCreated(
        uint256 id,
        string message
    );

    event JobCompleted(
        uint256 id,
        string dealId,
        string dataId
    );

    function setJobManagerAddress(address _jobManagerAddress) public onlyOwner {
        require(_jobManagerAddress != address(0), "Job manager address");
        jobManagerAddress = _jobManagerAddress;
        jobManagerContract = ILilypadJobManager(jobManagerAddress);
    }

    function getJobResult(uint256 _jobID) public view returns (string memory) {
        return jobResults[_jobID];
    }

    function runCowsay(
        string memory message
    ) public {
        string[] memory inputs = new string[](1);
        inputs[0] = string(abi.encodePacked("Message=", message));
        uint256 id = jobManagerContract.runJob(
        "cowsay:v0.0.3",
        inputs,
        msg.sender
        );

        emit JobCreated(
        id,
        message
        );
    }

    function submitResults(
        uint256 id,
        string memory dealId,
        string memory dataId
    ) public override {
        jobResults[id] = dataId;
        emit JobCompleted(
            id,
            dealId,
            dataId
        );
    }
}
