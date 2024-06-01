export const VaultiumContract = {
    contractName: "Vaultium",
    sourceName: "contracts/Vaultium.sol",
    abi: [
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_challengeTime",
                    type: "uint256"
                }
            ],
            stateMutability: "nonpayable",
            type: "constructor"
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "bytes32",
                    name: "gameHash",
                    type: "bytes32"
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "name",
                    type: "string"
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "publisher",
                    type: "string"
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "year",
                    type: "uint256"
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "country",
                    type: "string"
                },
                {
                    indexed: false,
                    internalType: "uint8[]",
                    name: "genres",
                    type: "uint8[]"
                }
            ],
            name: "GameAddedToSystem",
            type: "event"
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "_gameHash",
                    type: "bytes32"
                },
                {
                    internalType: "string",
                    name: "_ipfsCid",
                    type: "string"
                },
                {
                    internalType: "string",
                    name: "_imageCid",
                    type: "string"
                }
            ],
            name: "challengeAbandonwareVersion",
            outputs: [
                {
                    components: [
                        {
                            internalType: "bytes32",
                            name: "gameHash",
                            type: "bytes32"
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "bytes32",
                                            name: "gameHash",
                                            type: "bytes32"
                                        },
                                        {
                                            internalType: "string",
                                            name: "ipfsCid",
                                            type: "string"
                                        },
                                        {
                                            internalType: "string",
                                            name: "imageCid",
                                            type: "string"
                                        }
                                    ],
                                    internalType: "tuple",
                                    name: "gameVersion",
                                    type: "tuple"
                                },
                                {
                                    components: [
                                        {
                                            internalType: "uint32",
                                            name: "pointsCount",
                                            type: "uint32"
                                        },
                                        {
                                            internalType: "address",
                                            name: "voterAddress",
                                            type: "address"
                                        }
                                    ],
                                    internalType: "tuple[]",
                                    name: "votes",
                                    type: "tuple[]"
                                }
                            ],
                            internalType: "tuple",
                            name: "currentChallengeVersion",
                            type: "tuple"
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "bytes32",
                                            name: "gameHash",
                                            type: "bytes32"
                                        },
                                        {
                                            internalType: "string",
                                            name: "ipfsCid",
                                            type: "string"
                                        },
                                        {
                                            internalType: "string",
                                            name: "imageCid",
                                            type: "string"
                                        }
                                    ],
                                    internalType: "tuple",
                                    name: "gameVersion",
                                    type: "tuple"
                                },
                                {
                                    components: [
                                        {
                                            internalType: "uint32",
                                            name: "pointsCount",
                                            type: "uint32"
                                        },
                                        {
                                            internalType: "address",
                                            name: "voterAddress",
                                            type: "address"
                                        }
                                    ],
                                    internalType: "tuple[]",
                                    name: "votes",
                                    type: "tuple[]"
                                }
                            ],
                            internalType: "tuple",
                            name: "newChallengeVersion",
                            type: "tuple"
                        },
                        {
                            internalType: "uint256",
                            name: "currentVersionPoints",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "newVersionPoints",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "creationDate",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "closingDate",
                            type: "uint256"
                        }
                    ],
                    internalType: "tuple",
                    name: "",
                    type: "tuple"
                }
            ],
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "_gameHash",
                    type: "bytes32"
                }
            ],
            name: "closeChallengesIfNeeded",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "string",
                    name: "_name",
                    type: "string"
                },
                {
                    internalType: "string",
                    name: "_description",
                    type: "string"
                },
                {
                    internalType: "string",
                    name: "_publisher",
                    type: "string"
                },
                {
                    internalType: "uint16",
                    name: "_year",
                    type: "uint16"
                },
                {
                    internalType: "string",
                    name: "_country",
                    type: "string"
                },
                {
                    internalType: "uint8[]",
                    name: "_genres",
                    type: "uint8[]"
                }
            ],
            name: "createAbandonware",
            outputs: [
                {
                    components: [
                        {
                            internalType: "string",
                            name: "name",
                            type: "string"
                        },
                        {
                            internalType: "uint16",
                            name: "year",
                            type: "uint16"
                        },
                        {
                            internalType: "string",
                            name: "publisher",
                            type: "string"
                        },
                        {
                            internalType: "string",
                            name: "ipfsCid",
                            type: "string"
                        },
                        {
                            internalType: "string",
                            name: "imageCid",
                            type: "string"
                        },
                        {
                            internalType: "bool",
                            name: "isAbandonware",
                            type: "bool"
                        },
                        {
                            internalType: "string",
                            name: "description",
                            type: "string"
                        },
                        {
                            internalType: "bytes32",
                            name: "gameHash",
                            type: "bytes32"
                        },
                        {
                            internalType: "string",
                            name: "country",
                            type: "string"
                        },
                        {
                            internalType: "uint8[]",
                            name: "genres",
                            type: "uint8[]"
                        }
                    ],
                    internalType: "tuple",
                    name: "",
                    type: "tuple"
                }
            ],
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "_gameHash",
                    type: "bytes32"
                }
            ],
            name: "getAbandonware",
            outputs: [
                {
                    components: [
                        {
                            internalType: "string",
                            name: "name",
                            type: "string"
                        },
                        {
                            internalType: "uint16",
                            name: "year",
                            type: "uint16"
                        },
                        {
                            internalType: "string",
                            name: "publisher",
                            type: "string"
                        },
                        {
                            internalType: "string",
                            name: "ipfsCid",
                            type: "string"
                        },
                        {
                            internalType: "string",
                            name: "imageCid",
                            type: "string"
                        },
                        {
                            internalType: "bool",
                            name: "isAbandonware",
                            type: "bool"
                        },
                        {
                            internalType: "string",
                            name: "description",
                            type: "string"
                        },
                        {
                            internalType: "bytes32",
                            name: "gameHash",
                            type: "bytes32"
                        },
                        {
                            internalType: "string",
                            name: "country",
                            type: "string"
                        },
                        {
                            internalType: "uint8[]",
                            name: "genres",
                            type: "uint8[]"
                        }
                    ],
                    internalType: "tuple",
                    name: "",
                    type: "tuple"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "_gameHash",
                    type: "bytes32"
                }
            ],
            name: "getGameChallengeHistory",
            outputs: [
                {
                    components: [
                        {
                            internalType: "bytes32",
                            name: "gameHash",
                            type: "bytes32"
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "bytes32",
                                            name: "gameHash",
                                            type: "bytes32"
                                        },
                                        {
                                            internalType: "string",
                                            name: "ipfsCid",
                                            type: "string"
                                        },
                                        {
                                            internalType: "string",
                                            name: "imageCid",
                                            type: "string"
                                        }
                                    ],
                                    internalType: "tuple",
                                    name: "gameVersion",
                                    type: "tuple"
                                },
                                {
                                    components: [
                                        {
                                            internalType: "uint32",
                                            name: "pointsCount",
                                            type: "uint32"
                                        },
                                        {
                                            internalType: "address",
                                            name: "voterAddress",
                                            type: "address"
                                        }
                                    ],
                                    internalType: "tuple[]",
                                    name: "votes",
                                    type: "tuple[]"
                                }
                            ],
                            internalType: "tuple",
                            name: "currentChallengeVersion",
                            type: "tuple"
                        },
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            internalType: "bytes32",
                                            name: "gameHash",
                                            type: "bytes32"
                                        },
                                        {
                                            internalType: "string",
                                            name: "ipfsCid",
                                            type: "string"
                                        },
                                        {
                                            internalType: "string",
                                            name: "imageCid",
                                            type: "string"
                                        }
                                    ],
                                    internalType: "tuple",
                                    name: "gameVersion",
                                    type: "tuple"
                                },
                                {
                                    components: [
                                        {
                                            internalType: "uint32",
                                            name: "pointsCount",
                                            type: "uint32"
                                        },
                                        {
                                            internalType: "address",
                                            name: "voterAddress",
                                            type: "address"
                                        }
                                    ],
                                    internalType: "tuple[]",
                                    name: "votes",
                                    type: "tuple[]"
                                }
                            ],
                            internalType: "tuple",
                            name: "newChallengeVersion",
                            type: "tuple"
                        },
                        {
                            internalType: "uint256",
                            name: "currentVersionPoints",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "newVersionPoints",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "creationDate",
                            type: "uint256"
                        },
                        {
                            internalType: "uint256",
                            name: "closingDate",
                            type: "uint256"
                        }
                    ],
                    internalType: "tuple[]",
                    name: "",
                    type: "tuple[]"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [],
            name: "getVoteCount",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "_gameHash",
                    type: "bytes32"
                },
                {
                    internalType: "bool",
                    name: "voteCurrentVersion",
                    type: "bool"
                }
            ],
            name: "voteAbandonware",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
        }
    ],
    bytecode: "0x..."
};
