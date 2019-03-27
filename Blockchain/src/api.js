const express = require('express');
//const app = express();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const uuid = require('uuid/v1');
const nodeAddr = uuid();
const port = process.argv[2];

const reqPromise = require('request-promise');

const Blockchain = require('../src/blockchain');
const blockchainNetwork = new Blockchain();


app.get('/blockchain', function (req, res) {
    res.send(blockchainNetwork);
});



app.post('/transaction', function (req, res) {
    const transaction = req.body;
    const blockIndex = blockchainNetwork.addTransactionToPendingTransactions(transaction);

    res.json(
        {
            message: `Transaction will be added to block with index: ${blockIndex}`
        }
    );
});


app.post('/transaction/broadcast', function (req, res) {
    const transaction = blockchainNetwork.makeNewTransaction(
        req.body.cast,
        req.body.voter,
        req.body.candidate
    );
    blockchainNetwork.addTransactionToPendingTransactions(transaction);

    const requests = [];
    blockchainNetwork.networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri: networkNode + '/transaction',
            method: 'POST',
            body: transaction,
            json: true
        };

        requests.push(reqPromise(requestOptions));
    });
    
    Promise.all(requests)
        .then(data => {
            res.json(
                {
                    message: `Creating and broadcasting Transaction successfully!`
                }
            );
        });
    //  console.log("data", req.body.cast); 


});

app.get('/mine', function (req, res) {
    const latestBlock = blockchainNetwork.getLatestBlock();
    const prevBlockHash = latestBlock.hash;
    const currentBlockData = {
        transactions: blockchainNetwork.pendingTransactions,
        index: latestBlock.index + 1
    }
    const nonce = blockchainNetwork.proofOfWork(prevBlockHash, currentBlockData);
    const blockHash = blockchainNetwork.hashBlock(prevBlockHash, currentBlockData, nonce);

    const newBlock = blockchainNetwork.creatNewBlock(nonce, prevBlockHash, blockHash)

    const requests = [];
    
    
    blockchainNetwork.networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri: networkNode + '/add-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };

        requests.push(reqPromise(requestOptions));
    });

    
        res.json(
            {
                message: 'Mining & broadcasting new Block successfully!',
                newBlock: newBlock
            }
        );
    
/*
    Promise.all(requests)
        .then(data => {
            // reward for mining
            const requestOptions = {
                uri: blockchainNetwork.nodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    cast: 1,
                    voter: '00000',
                    candidate: nodeAddr
                },
                json: true
                
            };

            return reqPromise(requestOptions);
        })
        .then(data => {
            res.json(
                {
                    message: 'Mining & broadcasting new Block successfully!',
                    newBlock: newBlock
                }
            );
        });*/
});


app.post('/add-block', function (req, res) {
    const block = req.body.newBlock;
    const latestBlock = blockchainNetwork.getLatestBlock();

    if ((latestBlock.hash === block.prevBlockHash)
        && (block.index === latestBlock.index + 1)) {
        blockchainNetwork.chain.push(block);
        blockchainNetwork.pendingTransactions = [];

        res.json(
            {
                message: 'Add new Block successfully!',
                newBlock: block
            }
        );
    } else {
        res.json(
            {
                message: 'Cannot add new Block!',
                newBlock: block
            }
        );
    }
});

app.post('/register-and-broadcast-node', function (req, res) {
    const nodeUrl = req.body.nodeUrl;

    if (blockchainNetwork.networkNodes.indexOf(nodeUrl) == -1) {
        blockchainNetwork.networkNodes.push(nodeUrl);
    }

    const registerNodes = [];
    blockchainNetwork.networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri: networkNode + '/register-node',
            method: 'POST',
            body: { nodeUrl: nodeUrl },
            json: true
        };

        registerNodes.push(reqPromise(requestOptions));
    });

    Promise.all(registerNodes)
        .then(data => {
            const bulkRegisterOptions = {
                uri: nodeUrl + '/register-bulk-nodes',
                method: 'POST',
                body: { networkNodes: [...blockchainNetwork.networkNodes, blockchainNetwork.nodeUrl] },
                json: true
            };

            return reqPromise(bulkRegisterOptions);
        }).then(data => {
            res.json(
                {
                    message: 'A node registers with network successfully!'
                }
            );
        });
});

app.post('/register-node', function (req, res) {
    const nodeUrl = req.body.nodeUrl;

    if ((blockchainNetwork.networkNodes.indexOf(nodeUrl) == -1)
        && (blockchainNetwork.nodeUrl !== nodeUrl)) {
        blockchainNetwork.networkNodes.push(nodeUrl);

   //console.log(blockchainNetwork.networkNodes.indexOf(nodeUrl));
   //console.log(res);


        res.json(
            {
                message: 'A node registers successfully!'
                
            }
        );
    }
    else {
        res.json(
            {
                message: 'This node cannot register!'
            }
        );
    }
});

app.post('/register-bulk-nodes', function (req, res) {
    const networkNodes = req.body.networkNodes;

   /* networkNodes.forEach(nodeUrl => {
        if ((blockchainNetwork.networkNodes.indexOf(nodeUrl) == -1)
            && (blockchainNetwork.nodeUrl !== nodeUrl)) {
            blockchainNetwork.networkNodes.push(nodeUrl);
        }
    });  */



    Promise.all(registerNodes)
    .then(data => {
        const bulkRegisterOptions = {
            uri: nodeUrl + '/blockchain',
            method: 'POST',
            body: { nodeUrl: 'http://localhost:3002' },
            json: true
        };

        return reqPromise(bulkRegisterOptions);
    }).then(data => {
        res.json(
            {
                message: 'A node registers with network successfully!'
            }
        );
    });




    res.json(
        {
            message: 'Registering bulk successfully!'
        }
    );
});

app.get('/consensus', function (req, res) {
    const requests = [];
    blockchainNetwork.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: nodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        requests.push(reqPromise(requestOptions));
    });

    Promise.all(requests)
        .then(blockchains => {
            const currentChainLength = blockchainNetwork.chain.length;
            let maxChainLength = currentChainLength;
            let longestChain = null;
            let pendingTransactions = null;


            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    longestChain = blockchain.chain;
                    pendingTransactions = blockchain.pendingTransactions;
                }
            });

            if (!longestChain ||
                (longestChain && !blockchainNetwork.isChainValid(longestChain))) {
                res.json({
                    message: 'Current chain cannot be replaced!',
                    chain: blockchainNetwork.chain
                });
            } else if (longestChain && blockchainNetwork.isChainValid(longestChain)) {
                blockchainNetwork.chain = longestChain;
                blockchainNetwork.pendingTransactions = pendingTransactions;

                res.json({
                    message: 'Chain is updated!',
                    chain: blockchainNetwork.chain
                });
            }
        });
});

app.get('/block/:hash', function (req, res) {
    const hash = req.params.hash;
    const block = blockchainNetwork.findBlockByHash(hash);

    res.json({
        block: block
    });
});

app.get('/transaction/:id', function (req, res) {
    const id = req.params.id;
    const transactionInfo = blockchainNetwork.findTransactionById(id);

    if (transactionInfo !== null) {
        res.json({
            transaction: transactionInfo.transaction,
            block: transactionInfo.block
        });
    } else {
        res.json({
            transaction: null
        });
    }
});

app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const data = blockchainNetwork.findTransactionsByAddress(address);

    res.json({
        data: data
    });
});

app.listen(port, function () {
    console.log(`> listening on port ${port}...`);
});


