const express = require("express")
const router = express.Router()
const fs = require("fs")
//execute cmd Commands
const { execSync } = require('child_process')

module.exports = router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"
const FAUCET_ADDRESS = "A9c13244c9e66Ca2a061C500447C06b2698B7aE2"
//const MICUENTA = "704765a908962e25626f2bea8cdf96c84dedaa0b"


function createParams(network, node) {
    const INT_NETWORK = parseInt(network)
    const INT_NODE = parseInt(node)
    const NODE = `nodo${INT_NODE}`
    const NETWORK_DIR = `network${INT_NETWORK}`
    const NETWORK_CHAINID = 161615 + INT_NETWORK

    const HTTP_PORT = 8545 + INT_NODE + INT_NETWORK
    const DIR_NODE = `${NETWORK_DIR}/${NODE}`
    //const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
    const PORT = 30303 + INT_NODE + INT_NETWORK
    const AUTHRPC_PORT = 8553 + INT_NODE + INT_NETWORK

    return {
        INT_NETWORK, INT_NODE, NODE, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
        DIR_NODE, PORT, AUTHRPC_PORT
    }
}

function createBootNode(network_name) {

    //run docker command to create boot-key, replace .bootnode and bootnode by network_name-bootnode 
    //create bootkey    
    const docker_bootkey = "docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key"

    //prob need async await function
    const bootkeyResult = execSync(docker_bootkey)
    //const bootkeyResult = bootkeyResult.toString()
    //console.log(bootkeyResult);   

    // run docker command to create boot-node, replace ethereum-bootnode, .bootnode and bootnode by network_name-bootnode 
    //create bootkey   
    const docker_bootnode = "docker run -d -p 30301:30301 --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=9 --addr 0.0.0.0:30301"
    const bootnodeResult = execSync(docker_bootnode)

    // run docker command to retrieve enode for ethereum-bootnode for network_name-bootnode 
    // fetch enode 
    const docker_bootnode_enode = "docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1"
    const bootnode_enode = execSync(docker_bootnode_enode)

    return bootnode_enode
}


function createNodeDirectory(network_path, node_path) {
    console.log("Creating Directory");
    if (!fs.existsSync(network_path))
        fs.mkdirSync(network_path)
    if (!fs.existsSync(node_path))
        fs.mkdirSync(node_path)
}

function deleteNodeDirectory(network_path, node_path) {
    fs.rmSync(network_path, { recursive: true }, (err) => {
        if (err) {
            // File deletion failed
            console.error(err.message);
            console.log("Nothing to Delete");
            return;
        }
        console.log("Deleted successfully");

    })
    // //temp dummy function to wait for delete
    // init()    
}

async function init() {
    console.log(1);
    await sleep(1000);
    console.log(2);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function createAddress(node_path, node_name) {

    // Init first node to with genesis state and initiallize DB
    const docker_createAddress = `docker run --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir ${node_name}  account new --password /pwd.txt`
    execSync(docker_createAddress)

    const lista = fs.readdirSync(`${node_path}/keystore`)
    const address = JSON.parse(fs.readFileSync(`${node_path}/keystore/${lista[0]}`).toString()).address

    return address
}
//docker run --rm -v $(pwd)/nodo1:/nodo1  -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir nodo1 account list --keystore nodo1/keystore/



function generateGenesis(chain_id, signer_address, alloc_addresses, network_path) {
    //const timestamp = Math.round(((new Date()).getTime() / 1000)).toString(16)
    // leemos la plantilla del genesis
    let genesis = JSON.parse(fs.readFileSync('genesis_template.json').toString())

    // genesis.timestamp = `0x${timestamp}`
    genesis.config.chainId = chain_id
    genesis.extraData = `0x${'0'.repeat(64)}${signer_address}${'0'.repeat(130)}`


    genesis.alloc = alloc_addresses.reduce((acc, item) => {
        acc[item] = { balance: BALANCE }
        return acc
    }, {})


    fs.writeFileSync(`${network_path}/genesis.json`, JSON.stringify(genesis))

    const final_genesis = JSON.parse(fs.readFileSync(`${network_path}/genesis.json`).toString())
    return final_genesis
}


function initNodeDB(node_path, node_name, network_name) {

    // Init first node to with genesis state and initiallize DB
    const docker_init_node_DB = `docker run -d --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/${network_name}/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir ${node_name} /genesis.json`
    const initnode = execSync(docker_init_node_DB)

    return initnode
}

function startNode() {

    // Init first node to with genesis state and initiallize DB
    const docker_startNode = "docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --networkid 19999 --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x3ee83c6f0b679ab87460365851d67e28f46c210d' --password /pwd.txt --graphql --mine --miner.etherbase '0x9E5CC5E873e31C45779b15974c6F57e365a94C99' --miner.threads=2 --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'"
    const startNode = execSync(docker_startNode)

    return startNode
}



// I'm the network
router.post("/createNetwork/:network", (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = 1
    //const FAUCET_ADDRESS = parseInt(req.params.address)    
    //const FAUCET_ADDRESS = req.body.address

    //CREATE BOOT NODE --> Not needed for V1
    //const bootnode = createBootNode()

    //Initialize parameters 
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)

    //Initialize directory
    if (fs.existsSync(params.NETWORK_DIR)) {
        console.log("Directory Exists");
        deleteNodeDirectory(params.NETWORK_DIR, params.DIR_NODE)
    }
    createNodeDirectory(params.NETWORK_DIR, params.DIR_NODE)
    
    //createAddress
    const signer_address = createAddress(params.DIR_NODE, params.NODE)
    //res.status(200).send({ signer_address: signer_address });

    
    //create Allocated Addresses
    const alloc_addresses = [
        signer_address,
        FAUCET_ADDRESS
    ]  

    //create genesis state from genesis_template
    const genesis_file = generateGenesis(params.NETWORK_CHAINID, signer_address, alloc_addresses, params.NETWORK_DIR)
    //res.status(200).send({ genesis_file: genesis_file});

    
    //initialize nodeDB
    const initnodeDB = initNodeDB(params.DIR_NODE, params.NODE, params.NETWORK_DIR)
    //res.status(200).send({initnodeDB: initnodeDB.toString()});
    res.status(200).send({initnodeDB: initnodeDB.toString()});



    // //0x916353E14189A4bF8C57CEbE65aA357585f64c71

    // const goNode = startNode()

    // //res.status(200).send({bootnode: bootnode.toString()});
    // //res.status(200).send({initnodeDB: initnodeDB.toString()});
    // //res.status(200).send({addressnode: addressnode.toString()});
    // res.status(200).send({goNode: goNode.toString()});
})


// I'm the network
router.get("/", (req, res) => {
    res.send("I'm the network")
})




