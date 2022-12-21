// Create a Node

function createNetwork(network_id, faucet_address) {
    
    //create unique reference for node
    const node_number = 1
    const node = (network_id + node_number)

    // If node exists, 
    // removeNode (check can probably be done in front end), delete container
    removeNode(network_id, node_number)
    
    // remove Node DB, delete directory (if no access rights just leave)
    removeNodeDB()

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