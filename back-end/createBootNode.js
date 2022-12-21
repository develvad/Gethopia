// Remove a Node

function createBootNode(network_name) {
    
    //run docker command to create boot-key, replace .bootnode and bootnode by network_name-bootnode 
    const docker_bootkey = "docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key"

    //run docker command to create boot-node, replace ethereum-bootnode, .bootnode and bootnode by network_name-bootnode 
    const docker_bootnode = "docker run -d --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=3"

    //run docker command to retrieve enode for ethereum-bootnode for network_name-bootnode 
    const docker_bootnode_enode = "docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1"

    return docker_bootnode_enode
}