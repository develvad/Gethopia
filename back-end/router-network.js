const express = require("express")
const router = express.Router()
//execute cmd Commands
const {execSync} = require('child_process')


// function generateParameter(network, node) {
//     const NUMERO_NETWORK = parseInt(network)
//     const NUMERO_NODO = parseInt(node)
//     const NODO = `nodo${NUMERO_NODO}`
//     const NETWORK_DIR = `ETH/eth${NUMERO_NETWORK}`
//     const NETWORK_CHAINID = 333444 + NUMERO_NETWORK

//     const HTTP_PORT = 9545 + NUMERO_NODO + NUMERO_NETWORK * 20
//     const DIR_NODE = `${NETWORK_DIR}/${NODO}`
//     const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
//     const PORT = 30404 + NUMERO_NODO + NUMERO_NETWORK * 20
//     const AUTHRPC_PORT = 9553 + NUMERO_NODO + NUMERO_NETWORK * 20

//     return {
//         NUMERO_NETWORK, NUMERO_NODO, NODO, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
//         DIR_NODE, IPCPATH, PORT, AUTHRPC_PORT
//     }
// }



// Create a Node

function createNetwork(network_id, faucet_address) {
    
    //create unique reference for node
    const node_number = 1
    const node = (network_id + node_number)

    // If node exists, 
    // removeNode (check can probably be done in front end), delete container
    //// removeNode(network_id, node_number)
    
    // remove Node DB, delete directory (if no access rights just leave)
    //// removeNodeDB()

    // create boot node
    createBootNode()

    // Create Genesis State for new network
    //OPTIONAL to add custom faucet with faucet_address, otherwise grab default
    createGenesis(network_id, faucet_address)
    
    // Init first node to with genesis state and initiallize DB
    const docker_init_node_DB = "docker run -d --rm -v $(pwd)/nodo1:/root/.ethereum -v $(pwd)/genesis.json:/opt/genesis.json ethereum/client-go init /opt/genesis.json"  

    //  Init first node (First should be miner so need to adapt to include --mine --miner.etherbase ADDRESS --miner.threads=1)
    const docker_init_node = "docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 --name eth2 ethereum/client-go --datadir nodo1 --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --allow-insecure-unlock --graphql --bootnodes 'enode://fa27e7e91856d24c3486f6ef853bacd1be88fbd51480cb7a0abdbd73090e577f8c6bdeec9ed2fab679ee8808e47e8f0254cc56e9ee451424dae519beafbbf858@127.0.0.1:0?discport=30301'"
    
    // Create address 
    const docker_address = "docker exec eth2 geth --datadir nodo1 account new --password /nodo1/pwd.txt"

    // Init first node to with genesis state

    return genesis

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
    const docker_bootnode = "docker run -d --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=3"
    const bootnodeResult = execSync(docker_bootnode)

    // run docker command to retrieve enode for ethereum-bootnode for network_name-bootnode 
    // fetch enode 
    const docker_bootnode_enode = "docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1"
    const bootnode_enode = execSync(docker_bootnode_enode)

    return bootnode_enode
}

function initNodeDB() {
    
    // Init first node to with genesis state and initiallize DB
    const docker_init_node_DB = "docker run -d --rm -v $(pwd)/nodo1:/nodo1 -v $(pwd)/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir nodo1 /genesis.json"  
    const initnode = execSync(docker_init_node_DB)

    return initnode
}

function createAddress() {
    
    // Init first node to with genesis state and initiallize DB
    const docker_createAddress = "docker run --rm -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir nodo1 account new --password /pwd.txt "  
    const address = execSync(docker_createAddress)

    return address
}


function startNode() {
    
    // Init first node to with genesis state and initiallize DB
    const docker_startNode = "docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --networkid 19999 --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x3ee83c6f0b679ab87460365851d67e28f46c210d' --password /pwd.txt --graphql --mine --miner.etherbase '0x9E5CC5E873e31C45779b15974c6F57e365a94C99' --miner.threads=2 --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'"  
    const startNode = execSync(docker_startNode)

    return startNode
}

// function generateGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR) {
//     const timestamp = Math.round(((new Date()).getTime() / 1000)).toString(16)
//     // leemos la plantilla del genesis
//     let genesis = JSON.parse(fs.readFileSync('genesisbase.json').toString())

//     // genesis.timestamp = `0x${timestamp}`
//     genesis.config.chainId = NETWORK_CHAINID
//     genesis.extraData = `0x${'0'.repeat(64)}${CUENTA}${'0'.repeat(130)}`


//     genesis.alloc = CUENTAS_ALLOC.reduce((acc, item) => {
//         acc[item] = { balance: BALANCE }
//         return acc
//     }, {})


//     fs.writeFileSync(`${NETWORK_DIR}/genesis.json`, JSON.stringify(genesis))

// }



// I'm the network
router.post("/createNetwork/:network/:address", ( req, res ) => {
    const NUMERO_NETWORK = parseInt(req.params.network)
    const FAUCET_ADDRESS = parseInt(req.params.address)    
    
    
        //const FAUCET_ADDRESS = req.params.address    
        //const extraData = `0x${'0'.repeat(64)}${FAUCET_ADDRESS}${'0'.repeat(130)}`
        //console.log(extraData);

    const bootnode = createBootNode()

    //generateGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)
    //createParams (open ports, nodeNumber, networkDirectory, container_name...)

    const initnodeDB = initNodeDB()

    const addressnode = createAddress()

    //0x916353E14189A4bF8C57CEbE65aA357585f64c71

    const goNode = startNode()
    
    //res.status(200).send({bootnode: bootnode.toString()});
    //res.status(200).send({initnodeDB: initnodeDB.toString()});
    //res.status(200).send({addressnode: addressnode.toString()});
    res.status(200).send({goNode: goNode.toString()});
 })
 

// I'm the network
router.get("/", ( req, res ) => {
   res.send("I'm the network")
})


module.exports = router
 
