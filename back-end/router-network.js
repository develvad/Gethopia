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
const { log } = require("node:console");
const { createNoSubstitutionTemplateLiteral } = require("typescript");
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

    const HTTP_PORT = 8545 + INT_NODE + INT_NETWORK
    const DIR_NODE = `${NETWORK_DIR}/${NODE}`
    //const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
    const PORT = 30303 + INT_NODE + INT_NETWORK
    const AUTHRPC_PORT = 8552 + INT_NODE + INT_NETWORK

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
}

//async function createAddress(node_path, node_name) {
const createAddress = async (node_path, node_name) => {

    // Init first node to with genesis state and initiallize DB
    const docker_createAddress = `docker run --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir ${node_name}  account new --password /pwd.txt`
    execSync(docker_createAddress)

    const lista = fs.readdirSync(`${node_path}/keystore`)
    const address = JSON.parse(fs.readFileSync(`${node_path}/keystore/${lista[0]}`).toString()).address

    return address

}

//async function createAddress(node_path, node_name) {
const createAddress2 = async (node_path, node_name) => {

    // Init first node to with genesis state and initiallize DB
    // const docker_createAddress = `docker run --rm -v $(pwd)/${node_path}:/${node_name} -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir ${node_name}  account new --password /pwd.txt`
    // execSync(docker_createAddress)

    // const staticNodeName = 'nodo_' + req.params.name;
    // const dataToReturn = {};

    // const promisifyStream = (stream) => new Promise((resolve, reject) => {
    //     stream.on('data', (d) => console.log(d.toString()))
    //     stream.on('end', resolve)
    //     stream.on('error', reject)
    //   })

    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'account_creator',
        Cmd: ['geth', '--datadir', node_name, 'account', 'new', '--password', 'pwd.txt'],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) + "/" + node_path,
                Destination: "/" + node_name,
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
            {
                Type: "bind",
                Source: path.join(__dirname) + "/pwd.txt",
                Destination: "/pwd.txt",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            }
        ],
        HostConfig: {
            Binds: [
                path.join(__dirname) + '/' + node_path + ":/" + node_name,
                path.join(__dirname) + '/pwd.txt:/pwd.txt',
            ]
        }
    }).then(async (container) => {
            await container.start();
            const containerData = {
                id: container.Id,
                name: node_name
            }
            console.log('Account Created: ', containerData);
            return "OK"
        })
    // .then(container => container.start())
    // .then
    // .then((container) => {
    //     _container = container
    //     return container.exec.create({
    //       AttachStdout: true,
    //       AttachStderr: true,
    //       Cmd: [ 'echo', 'test' ]
    //     })
    //   })
    // .then((exec) => {
    //  return exec.start({ Detach: false })
    // })
    // .then((stream) => promisifyStream(stream))
    // .then(() => _container.kill())
    // .catch((error) => console.log(error))

    // const lista = fs.readdirSync(`${node_path}/keystore`)
    // const address = JSON.parse(fs.readFileSync(`${node_path}/keystore/${lista[0]}`).toString()).address

}



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
    //const initnode = execSync(docker_init_node_DB)
    //return docker_init_node_DB

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


async function initNodeDB2(node_path, node_name, network_name) {
    //    const staticName = 'Genesis_' + req.params.name;
    //const staticNodeName = 'nodo_' + req.params.name;
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'initDB',
        Cmd: ['geth', 'init', '--datadir', node_name, '/genesis.json'],
        // Mounts: [
        //     {
        //         Type: "bind",
        //         Source: path.join(__dirname) + "/" + node_path,
        //         Destination: "/" + node_name,
        //         Mode: "",
        //         RW: true,
        //         Propagation: "rprivate"
        //     },
        //     {
        //         Type: "bind",
        //         Source: path.join(__dirname) + "/" + network_name + "/genesis.json",
        //         Destination: "/genesis.json",
        //         Mode: "",
        //         RW: true,
        //         Propagation: "rprivate"
        //     }],
        HostConfig: {
            Binds: [
                path.join(__dirname) + "/" + node_path + ":/" + node_name,
                path.join(__dirname) + "/" + network_name + "/genesis.json:/genesis.json"
            ],
        },
    }).then((container) => container.start());
};


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


async function startNode(params, signer_address) {
    await delay(5000);
    console.log("START NODE");

    // Init first node to with genesis state and initiallize DB
    //const docker_startNode = "docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --networkid 19999 --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x3ee83c6f0b679ab87460365851d67e28f46c210d' --password /pwd.txt --graphql --mine --miner.etherbase '0x9E5CC5E873e31C45779b15974c6F57e365a94C99' --miner.threads=2 --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'"
    const docker_startNode =
        `docker run -d \
    -p ${params.HTTP_PORT}:${params.HTTP_PORT} \
    -p ${params.PORT}:${params.PORT} \
    -v $(pwd)/${params.DIR_NODE}:/${params.NODE} \
    -v $(pwd)/pwd.txt:/pwd.txt \
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

    // const startNode = execSync(docker_startNode).then(i => {
    //     console.log(docker_startNode);
    // })
    return result2
}

//async function startNode2(NODE, DIR_NODE, AUTHRPC_PORT, HTTP_PORT, PORT, signer_address) {
async function startNode2(params,signer_address) {
    await delay(5000);
    console.log("START NODE");

    const { NODE, DIR_NODE, AUTHRPC_PORT, HTTP_PORT, PORT } = params

    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: NODE, //NODE
        Cmd: [
            'geth',
            '--datadir',
            NODE, //NODE
            '--syncmode',
            'full',
            '--http',
            '--http.addr',
            '0.0.0.0',
            '--http.api',
            'admin,eth,miner,net,txpool,personal',
            '--http.port',
            HTTP_PORT.toString(), // TODO: HTTP_PORT
            '--http.corsdomain',
            "'*'",
            '--allow-insecure-unlock',
            '-unlock',
            `0x${signer_address}`, ///////////// TODO: Signer Address
            '--password',
            'pwd.txt',
            '--port',
            PORT.toString(), // TODO: PORT
            '--authrpc.port',
            AUTHRPC_PORT.toString(), // TODO: AUTHRPC_PORT
            '--mine',
            '--miner.threads=2',
            '--graphql'
        ],
        // Ports: [
        //     {
        //         PrivatePort: PORT,
        //         PublicPort: PORT,
        //         Type: "tcp"
        //     },
        //     {
        //         PrivatePort: PORT,
        //         PublicPort: PORT,
        //         Type: "udp"
        //     },
        //     {
        //         PrivatePort: HTTP_PORT,
        //         PublicPort: HTTP_PORT,
        //         Type: "tcp"
        //     }
        //     // {
        //     //     PrivatePort: 8546,
        //     //     PublicPort: 8546,
        //     //     Type: "tcp"
        //     // }
        // ],
        // Mounts: [
        //     {
        //         Type: "bind",
        //         Source: path.join(__dirname) + "/" + DIR_NODE,
        //         Destination: "/" + NODE,
        //         Mode: "",
        //         RW: true,
        //         Propagation: "rprivate"
        //     },
        //     {
        //         Type: "bind",
        //         Source: path.join(__dirname) + "/pwd.txt",
        //         Destination: "/pwd.txt",
        //         Mode: "",
        //         RW: true,
        //         Propagation: "rprivate"
        //     }
            // {
            //     Type: "bind",
            //     Source: path.join(__dirname) + "/genesis.json",
            //     Destination: "/genesis.json",
            //     Mode: "",
            //     RW: true,
            //     Propagation: "rprivate"
            // },
        // ],
        ExposedPorts: {
                "30303/tcp": {},
                "30303/udp": {},
                "30315/tcp": {},
                "8557/tcp": {},
                "8546/tcp": {}
        }, 
        HostConfig: {
            Binds: [
                path.join(__dirname) + '/' + DIR_NODE + ':/' + NODE,
                path.join(__dirname) + '/pwd.txt:/pwd.txt',
                // path.join(__dirname) + "/genesis.json:/genesis.json"


            ],  
            PortBindings: {
                '30315/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: PORT.toString()
                    },
                ],
                // '30315/udp': [
                //     {
                //         HostIp: '0.0.0.0',
                //         HostPort: PORT.toString()
                //     }
                // ],
                '8557/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: HTTP_PORT.toString()
                    }
                ]
                // '8546/tcp': [
                //     {
                //         HostIp: '0.0.0.0',
                //         HostPort: '8546'
                //     }
                // ],
            },
            NetworkMode: "br0"
            // NetworkMode: "gethopia"
        }
    }).then((container) => container.start());

    return
}

// Create the network
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
    delay(2000)
    //res.status(200).send({initnodeDB: initnodeDB.toString()});

    //update/create static-nodes.json
    // const sn_type = 'create'
    // const staticNodes = staticNodes(params.DIR_NODE, params.NODE, params.NETWORK_DIR)

    //signer_address = 'b6da28fee3e0cb52df1fe72a74b271b3bc385d38'
    //start container_node
    const goNode = startNode(params, signer_address)
    res.status(200).send({goNode: goNode.toString()});
})

// Delete the Network
router.delete("/deleteNetwork/:network", (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NETWORK_DIR = `net${NETWORK_NUMBER}`
    const INT_NODE = 1
    const NODE = `${NETWORK_DIR}nodo${INT_NODE}`

    //stop node
    const docker_remove_network = `docker rm -f ${NODE}`
    const result = exec(docker_remove_network, (error, stdout, stderr) => {
        console.log("borrando")
        if (error) {
            res.send({ error })
            return
        }
    })
    //execSync(docker_remove_network)

    //remove all network files
    fs.rmSync(NETWORK_DIR, { recursive: true }, (err) => {
        if (err) {
            // File deletion failed
            console.error(err.message);
            console.log("Nothing to Delete");
            return;
        }
        console.log("Deleted successfully");
    })
    res.status(200).send({ NetworkRemoved: "OK" });

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TEMP Create an address
router.post("/createAddress/:network", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = 1

    //Initialize parameters 
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)

    //Initialize directory
    if (fs.existsSync(params.NETWORK_DIR)) {
        console.log("Directory Exists");
        deleteNodeDirectory(params.NETWORK_DIR, params.DIR_NODE)
    }
    createNodeDirectory(params.NETWORK_DIR, params.DIR_NODE)

    //createAddress
    const signer_address = createAddress2(params.DIR_NODE, params.NODE)
    //res.status(200).send({ signer_address: signer_address });

})

// TEMP Create the node
router.post("/createDB/:network", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = 1
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)
    const signer_address = await getSignerForNode(req.params.network);
    //create Allocated Addresses
    const alloc_addresses = [
        signer_address,
        FAUCET_ADDRESS
    ]

    //create genesis state from genesis_template
    const genesis_file = generateGenesis(params.NETWORK_CHAINID, signer_address, alloc_addresses, params.NETWORK_DIR)
    //res.status(200).send({ genesis_file: genesis_file});
    const goNode = await initNodeDB2(params.DIR_NODE, params.NODE, params.NETWORK_DIR)
    res.status(200).send({ goNode: goNode });
})

// TEMP Create the node
router.post("/createContainer/:network", async (req, res) => {
    const NETWORK_NUMBER = parseInt(req.params.network)
    const NODE_NUMBER = 1
    const params = createParams(NETWORK_NUMBER, NODE_NUMBER)
    const signer_address = await getSignerForNode(req.params.network);
    //const goNode = await startNode2(params.NODE, params.DIR_NODE, params.AUTHRPC_PORT, params.HTTP_PORT, params.PORT, signer_address)
    const goNode = await startNode2(params, signer_address)
    res.status(200).send({ goNode: goNode });
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// I'm the network
router.get("/", (req, res) => {
    res.send("I'm the network");
})

// Primero automatizamos el proceso de coger el signer address
const getSignerForNode = async (id) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname) + '/net' + id + '/net' + id + 'nodo1' + '/keystore',
            (err, files) => {
                if (err) {
                    console.log('ERR GET_SIGNER_FOR_NODE: ', err);
                    reject(err);
                }
                const data = fs.readFileSync(path.join(__dirname) + '/net' + id + '/net' + id + 'nodo1' + '/keystore/' + files[0], 'utf8');
                const { address } = JSON.parse(data);
                resolve(address)
            });
    });
}

//  Listamos las redes activas.
router.get('/listAll', (req, res) => {
    docker.container.list()
        .then((containers) => {
            const mapeado = containers.map((e) => {
                return {
                    id: e.data.Id,
                    name: e.data.Names[0]
                }
            });
            res.send(mapeado);
        }).catch((e) => res.status(500).send({ res: e.message }))
});
