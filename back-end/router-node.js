const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const { Docker } = require('node-docker-api');
const cors = require('cors');

//execute cmd Commands
const { execSync, spawn, spawnSync } = require("child_process");
const util = require('node:util');
const exec = util.promisify(require('child_process').exec);
const path = require("node:path");
module.exports = router

const BALANCE = "0x200000000000000000000000000000000000000000000000000000000000000"
const FAUCET_ADDRESS = "A9c13244c9e66Ca2a061C500447C06b2698B7aE2"
//const MICUENTA = "704765a908962e25626f2bea8cdf96c84dedaa0b"
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

//cors
router.use(cors())

function createParams(network, node) {
    const INT_NETWORK = parseInt(network)
    const INT_NODE = parseInt(node)
    const NETWORK_DIR = `net${INT_NETWORK}`
    const NODE = `${NETWORK_DIR}nodo${INT_NODE}`
    const NETWORK_CHAINID = 161615 + INT_NETWORK

    const HTTP_PORT = 8545 + INT_NODE + INT_NETWORK * 10
    const DIR_NODE = `${NETWORK_DIR}/${NODE}`
    //const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
    const PORT = 30303 + INT_NODE + INT_NETWORK * 10
    const AUTHRPC_PORT = 8552 + INT_NODE + INT_NETWORK * 10

    return {
        INT_NETWORK, INT_NODE, NODE, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
        DIR_NODE, PORT, AUTHRPC_PORT
    }
}



function createNodeDirectory(node_path) {
    console.log("Creating Node Directory");
    if (!fs.existsSync(node_path))
        fs.mkdirSync(node_path)
}

function deleteNodeDirectory(node_path) {
    fs.rmSync(node_path, { recursive: true }, (err) => {
        if (err) {
            // File deletion failed
            console.error(err.message);
            console.log("Nothing to Delete");
            return;
        }
        console.log("Deleted successfully");
    })
}

function createAddress(node_path, node_name) {

    // Init first node to with genesis state and initiallize DB
    //const docker_createAddress = `docker run --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir ${node_name}  account new --password /pwd.txt`
    const docker_createAddress = 'docker run --rm -v ' + path.join(__dirname, node_path) + `:/${node_name} -v ` + path.join(__dirname, 'pwd.txt') + `/:/pwd.txt --name account_creator ethereum/client-go --datadir ${node_name}  account new --password /pwd.txt`
    execSync(docker_createAddress)

    return //address
}

function initNodeDB(node_path, node_name, network_name) {

    // Init first node to with genesis state and initiallize DB
    //const docker_init_node_DB = `docker run -d --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/${network_name}/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir ${node_name} /genesis.json`
    const docker_init_node_DB = 'docker run -d --rm -v ' + path.join(__dirname, node_path) + `:/${node_name} -v` + path.join(__dirname, network_name, 'genesis.json') + `:/genesis.json --name initDB ethereum/client-go init --datadir ${node_name} /genesis.json`
    //const initnode = execSync(docker_init_node_DB)
    //return docker_init_nodepues _DB

    async function lsExample() {
        const { stdout, stderr } = await exec(docker_init_node_DB);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
        return stdout;
    }
    const result = lsExample();
    ////process.exit()

    return result

}

const staticNodes = (network_name) => {

    const nodos = fs.readdirSync(network_name, { withFileTypes: true })
        .filter(i => !i.isFile())
    console.log(nodos[1].name);

    //if more than 9 nodes will need to revisit
    const props = nodos.map(i => {
        return ({
            network: network_name,
            name: i.name,
            port: (30303 + parseInt(i.name.slice(-1)) + parseInt(network_name.slice(-1))).toString(),
            nodekey: fs.readFileSync(`${network_name}/${i.name}/geth/nodekey`).toString()
        })
    })
    //console.log(props);

    //Create static-nodes.json
    const staticNodes = props.map(i => `enode://${i.nodekey}@${i.name}:${i.port}`)
    console.log(staticNodes);
 
    //Check if static-nodes.json file exists and delete for each node + create new static-nodes.json
    props.forEach(i => {
        if (fs.existsSync(path.join(__dirname, i.network) + "/" + i.name+ "/static-nodes.json")) {
            console.log("static-nodes.json exists");
            fs.unlinkSync(path.join(__dirname, i.network) + "/" + i.name + "/static-nodes.json")
            console.log(i.name, " static-nodes.json deleted");
        }
        fs.writeFileSync(path.join(__dirname, i.network) + "/" + i.name + "/static-nodes.json", JSON.stringify(staticNodes))    
    })

    return props
}


async function startNode(params, signer_address) {
    console.log("START NODE");

    const docker_startNode =
        `docker run -d \
        --network br0 \
    -p ${params.HTTP_PORT}:${params.HTTP_PORT} \
    -p ${params.PORT}:${params.PORT} \
    -v ` + path.join(__dirname, params.DIR_NODE) + `:/${params.NODE} \
    -v ` + path.join(__dirname, 'pwd.txt') + `:/pwd.txt \
    --name ${params.NODE} ethereum/client-go \
    --datadir ${params.NODE} \
    --syncmode full \
    --http.api personal,eth,net,web3 \
    --http \
    --http.addr 0.0.0.0 \
    -http.port ${params.HTTP_PORT} \
    --authrpc.port ${params.AUTHRPC_PORT}  \
    --http.corsdomain '*' \
    --allow-insecure-unlock \
    --unlock '0x${signer_address}' \
    --password /pwd.txt \
    --graphql \
    --mine \
    --miner.threads=2`
    //const startNode = execSync(docker_startNode)

    async function lsExample2() {
        const { stdout, stderr } = await exec(docker_startNode);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
        return stdout;
    }
    const result2 = lsExample2();
    
    return result2
}


// Delete the Network
router.delete("/deleteNode/:network/:node", (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NETWORK_DIR = `net${NETWORK_NUMBER}`
    const INT_NODE = 1
    const NODE = `${NETWORK_DIR}nodo${INT_NODE}`

    ///////////// TO BE DONE
    ///////////// TO BE DONE
    
    res.status(200).send({ NetworkRemoved: "OK" });

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TEMP Create an address
router.post("/createNodeAddress/:network/:node", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = parseInt(req.params.node)

    //Initialize parameters 
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)

    //Initialize directory
    if (fs.existsSync(params.DIR_NODE)) {
        console.log("Node Directory Exists");
        deleteNodeDirectory(params.DIR_NODE)
    }
    createNodeDirectory(params.DIR_NODE)

    //createAddress
    const signer_address = createAddress(params.DIR_NODE, params.NODE)
    res.status(200).send({ signer_address: signer_address });

})

// TEMP Create the node
router.post("/createNodeDB/:network/:node", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = parseInt(req.params.node)
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)
    const signer_address = await getSignerForNode(params.DIR_NODE.toString());
    //create Allocated Addresses
    const alloc_addresses = [
        signer_address,
        FAUCET_ADDRESS
    ]
    //res.status(200).send({ genesis_file: genesis_file});
    const initNode = await initNodeDB(params.DIR_NODE, params.NODE, params.NETWORK_DIR)

    res.status(200).send({ initNode: initNode.toString() });
})




// TEMP Create the node
router.post("/createNodeContainer/:network/:node", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = parseInt(req.params.node)
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)
    const signer_address = await getSignerForNode(params.DIR_NODE.toString());
    const goNode = await startNode(params, signer_address)
    res.status(200).send({ goNode: goNode.toString() });
})



// I'm the network
router.get("/", (req, res) => {
    res.send("I'm the node");
})

// Primero automatizamos el proceso de coger el signer address
const getSignerForNode = async (nodepath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, nodepath) + '/keystore',
            (err, files) => {
                if (err) {
                    console.log('ERR GET_SIGNER_FOR_NODE: ', err);
                    reject(err);
                }
                const data = fs.readFileSync(path.join(__dirname, nodepath) + '/keystore/' + files[0], 'utf8');
                const { address } = JSON.parse(data);
                resolve(address)
            });
    });
}


router.get("/staticNode/:network", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NETWORK_DIR = `net${NETWORK_NUMBER}`
    // const NODE_NUMBER = 1
    // const params = createParams(NETWORK_NUMBER, NODE_NUMBER)
    // console.log("params: ", params);
    const response = staticNodes(NETWORK_DIR)
    res.status(200).send({ Reply: response })

})

