// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

contract MockVaultium {
    enum Genres {
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

    struct GameInfo {
        string name;
        uint16 year;
        string publisher;
        string ipfsCid;
        Genres genre;
        bool isAbandonware;
        string description;
        bytes32 gameHash;
    }

    mapping(bytes32 => GameInfo) public game;

    event GameAddedToSystem(
        bytes32 gameHash,
        string name,
        Genres genre,
        string publisher,
        uint year
    );

    event VersionChallenged(
        bytes32 gameHash,
        string ipfsCid
    );

    event VersionChallengeAccepted(
        bytes32 gameHash,
        string ipfsCid
    );

    function getGameHash(
        string calldata _name,
        uint16 _year,
        string calldata _publisher
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _year, _publisher));
    }

    function searchAbandonware(
        string calldata _name,
        string calldata _description,
        string calldata _publisher,
        Genres _genre,
        uint16 _year
    ) public returns (bytes32) {
        require(bytes(_name).length > 0, "Missing name");
        require(bytes(_publisher).length > 0, "Missing publisher");
        require(_year > 0, "Missing year");

        bytes32 gameHash = getGameHash(_name, _year, _publisher);
        game[gameHash] = GameInfo({
            name: _name,
            year: _year,
            publisher: _publisher,
            ipfsCid: "",
            genre: _genre,
            isAbandonware: true,
            description: _description,
            gameHash: gameHash
        });
        emit GameAddedToSystem(gameHash, _name, _genre, _publisher, _year);
        return gameHash;
    }

    function challengeAbandonwareVersion(
        bytes32 _gameHash, 
        string calldata _ipfsCid
    ) public {
        game[_gameHash].ipfsCid = _ipfsCid;
        emit VersionChallenged(_gameHash, _ipfsCid);
        emit VersionChallengeAccepted(_gameHash, _ipfsCid);
    }
}
