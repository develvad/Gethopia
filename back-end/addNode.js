// Create a Node

function addNode(network_name, miner_node) {
    
    // Retrieve latest node for that network (from array possibly)

    // Retrieve associated genesis_file (possibly search by name or from parameter in frontend)

    //create unique reference for node
    const node = (network_name + node_number)

    // Init node with genesis state and initiallize DB
    //run docker command 
    const docker_init_node_DB = "docker run -d --rm -v $(pwd)/nodo1:/root/.ethereum -v $(pwd)/genesis.json:/opt/genesis.json ethereum/client-go init /opt/genesis.json"  

    //IF mine_node RUN ONE COMMAND OR THE OTHER (with or without --miner.etherbase ADDRESS --miner.threads=1)
    // Init node
    const docker_init_node = "docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 --name eth2 ethereum/client-go --datadir nodo1 --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --allow-insecure-unlock --graphql --bootnodes 'enode://fa27e7e91856d24c3486f6ef853bacd1be88fbd51480cb7a0abdbd73090e577f8c6bdeec9ed2fab679ee8808e47e8f0254cc56e9ee451424dae519beafbbf858@127.0.0.1:0?discport=30301'"
    
    return genesis

}

createGenesis(networkid, faucet_address)