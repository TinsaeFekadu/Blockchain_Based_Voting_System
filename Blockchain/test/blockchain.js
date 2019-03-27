const Blockchain = require('../src/blockchain');


const bitcoin = new Blockchain();

const blockchain =
    {
        "chain": [
            {
                "index": 1,
                "timestamp": 1528598849808,
                "transactions": [],
                "nonce": 100,
                "hash": "Genesis block",
                "prevBlockHash": "0"
            },
            {
                "index": 2,
                "timestamp": 1528598877327,
                "transactions": [],
                "nonce": 44,
                "hash": "00669af06fa8d395bea4f6325d39f43a3c87788152fc3050608aa23e55dfe964",
                "prevBlockHash": "Genesis block"
            },
            {
                "index": 3,
                "timestamp": 1528598933363,
                "transactions": [
                    {
                        "amount": 1,
                        "sender": "00000",
                        "recipient": "99ad6680-6c58-11e8-9aec-bb32ede6ec12",
                        "id": "ae7894e06c5811e89aecbb32ede6ec12"
                    },
                    {
                        "amount": 30,
                        "sender": "JASON",
                        "recipient": "JACK",
                        "id": "bf03a8906c5811e89aecbb32ede6ec12"
                    },
                    {
                        "amount": 120,
                        "sender": "JACK",
                        "recipient": "KATHERIN",
                        "id": "c5d2d2906c5811e89aecbb32ede6ec12"
                    }
                ],
                "nonce": 532,
                "hash": "0057e643b3c1f21e69f124c34f6af18b5025df37ca9c94e7266d15711a643a4b",
                "prevBlockHash": "00669af06fa8d395bea4f6325d39f43a3c87788152fc3050608aa23e55dfe964"
            },
            {
                "index": 4,
                "timestamp": 1528598960172,
                "transactions": [
                    {
                        "amount": 1,
                        "sender": "00000",
                        "recipient": "99ad6680-6c58-11e8-9aec-bb32ede6ec12",
                        "id": "cfc758706c5811e89aecbb32ede6ec12"
                    },
                    {
                        "amount": 60,
                        "sender": "JACK",
                        "recipient": "JASON",
                        "id": "db9afe906c5811e89aecbb32ede6ec12"
                    }
                ],
                "nonce": 56,
                "hash": "00ced1d066124fccfc6e400675313086a062f5bbdc2206a5e44192eead2a43fc",
                "prevBlockHash": "0057e643b3c1f21e69f124c34f6af18b5025df37ca9c94e7266d15711a643a4b"
            },
            {
                "index": 5,
                "timestamp": 1528598995412,
                "transactions": [
                    {
                        "amount": 1,
                        "sender": "00000",
                        "recipient": "99ad6680-6c58-11e8-9aec-bb32ede6ec12",
                        "id": "dfc213006c5811e89aecbb32ede6ec12"
                    }
                ],
                "nonce": 166,
                "hash": "00a392d4b7ac4a691913630606742171a779c4562d1654d2812d4fcef8dd01c0",
                "prevBlockHash": "00ced1d066124fccfc6e400675313086a062f5bbdc2206a5e44192eead2a43fc"
            },
            {
                "index": 6,
                "timestamp": 1528599017364,
                "transactions": [
                    {
                        "amount": 1,
                        "sender": "00000",
                        "recipient": "99ad6680-6c58-11e8-9aec-bb32ede6ec12",
                        "id": "f4c31e706c5811e89aecbb32ede6ec12"
                    },
                    {
                        "amount": 160,
                        "sender": "KATHERIN",
                        "recipient": "JASON",
                        "id": "fb6481b06c5811e89aecbb32ede6ec12"
                    },
                    {
                        "amount": 25,
                        "sender": "KATHERIN",
                        "recipient": "JACK",
                        "id": "000078006c5911e89aecbb32ede6ec12"
                    }
                ],
                "nonce": 1144,
                "hash": "008fce29f82e008dd411c8e5ef1f8216011207a3a58949753826abdf2e192f94",
                "prevBlockHash": "00a392d4b7ac4a691913630606742171a779c4562d1654d2812d4fcef8dd01c0"
            }
        ],
        "pendingTransactions": [
            {
                "amount": 1,
                "sender": "00000",
                "recipient": "99ad6680-6c58-11e8-9aec-bb32ede6ec12",
                "id": "01d8ba706c5911e89aecbb32ede6ec12"
            }
        ],
        "nodeUrl": "http://localhost:3001",
        "networkNodes": []
    };

    console.log('isValid:', bitcoin.isChainValid(blockchain.chain)); 