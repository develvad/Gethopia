# REPO REFERENCIA 
https://github.com/vertigobr/ethereum
https://github.com/dawar2151/ethereum-docker/blob/master/start.sh 

# FLUJO PRINCIPAL SECUENCIA 
## 1 - Create new Network (includes 1 node deafult como en la diapo )
createNetworK.js
## 1.1 - Remove Existing Node
removeNode.js
## 1.2 - Remove Node DB
removeNodeDB.js
## 1.3 - Create Bootnode
createBootNode.js
## 1.4 - CreateGenesis (from template)
createGenesis.js
## 1.5 - Init Node DB (Docker)
## 1.6 - Geth Init Node (Docker)
## 1.7 - Crear Addresses (Docker)
## 1.8 - Unlock Address (Docker)


## 2 - Remove Node
removeNode.js

## 3 - Remove Network
removeNetwork.js

## 3 - Add Node
addNode.js

# QUICK ACCESS DOCKER COMMANDS

## 1.1 - Remove Existing Node
docker stop node
docker remove node

## 1.2 - Obtain node for enode
docker run --rm -v $(pwd)/nodo1:/nodo1 ethereum/client-go:alltools-latest bootnode --nodekey /nodo1/geth/nodekey -writeaddress

    "enode://45d9be63b582010352fa6d9aa886182e762c331f6ba7aef27d39aa16705d693f88932dd2cf8045e5614c4cb0e5999b8ada66c4e216b79c5d5eb1badda1393d72@127.0.0.1:30303"
    "enode://45d9be63b582010352fa6d9aa886182e762c331f6ba7aef27d39aa16705d693f88932dd2cf8045e5614c4cb0e5999b8ada66c4e216b79c5d5eb1badda1393d72@eth2:30303"
    docker run --rm -v $(pwd)/nodo2:/nodo2 ethereum/client-go:alltools-latest bootnode --nodekey /nodo2/geth/nodekey -writeaddress
    "enode://0002f51fcb4c82bfd54ae2d5534e5273228b105f83cd4a0ba6e93ff5a2fc6172f814b248363bf54c910bf66f9e34401b042b75ba1eafe7f9c017a7809901f145@127.0.0.1:30304"
    "enode://1595c4f91e985ccef30ed9c60f274be8217edd36db7bab524d804cd8e1936f2353fce4ce71efa66917965603b3f9cc4081f816165263809cfdd49d59209ac628@eth3:30304"
    docker run --rm -v $(pwd)/nodo3:/nodo3 ethereum/client-go:alltools-latest bootnode --nodekey /nodo3/geth/nodekey -writeaddress
    "enode://d544a1c55f20c291d64b2e83d305a73dff649bd51da27f602f271c782e33c5eae42ab2f84a9316f573879d6487b3150f7ea47361472573d88d10122b1dcfb654@127.0.0.1:30305"

Obviously, to store the complete enode in a variable you need to have access to the IP and the port in bash:

 PORT=<insert-the-port-of-the-node>
 IP_ADDRESS=<insert-the-ip-of-the-machine>
 NODEKEY=$(bootnode -nodekey <your-node-key-file> -writeaddress)

 ENODE_ADDRESS="enode://$NODEKEY@$IP_ADDRESS:$PORT"


    ## 1.3 - Create Bootnode
    docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key
    docker run --network br0 -p 30301:30301 --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=9
    docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1


    docker run -p 30301:30301 -p 30303:30303/udp --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=9
    docker run -p 30301:30301 --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=9 --addr 0.0.0.0:30310


## 1.5 - Init Node DB (Docker) (Con una alternativa para lectura facil)
docker run -d --rm -v $(pwd)/nodo1:/nodo1 -v $(pwd)/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir nodo1 /genesis.json

docker run -d --rm \
-v $(pwd)/nodo1:/root/.ethereum \
-v $(pwd)/genesis.json:/opt/genesis.json \
ethereum/client-go init /opt/genesis.json 

## 1.5 BIS Node 2 & 3
docker run -d --rm -v $(pwd)/nodo2:/nodo2 -v $(pwd)/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir nodo2 /genesis.json
docker run -d --rm -v $(pwd)/nodo3:/nodo3 -v $(pwd)/genesis.json:/genesis.json --name initDB ethereum/client-go init --datadir nodo3 /genesis.json

## 1.6 - Crear Addresses (Docker)
docker run --rm -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir nodo1 account new --password /pwd.txt 
docker run --rm -v $(pwd)/nodo2:/nodo2 -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir nodo2 account new --password /pwd.txt 
docker run --rm -v $(pwd)/nodo3:/nodo3 -v $(pwd)/pwd.txt:/pwd.txt --name account_creator ethereum/client-go --datadir nodo3 account new --password /pwd.txt 


## 1.6.1 Store resulting address (Can read filename and last 40 characters)
nodo1--'0x92625351eec7342813ced5251beebd0bd4caca70'
nodo2--'0x204ab07e0851b4570b66c96704afa5a4d1ab100a'
nodo3--'0xd81c45e079b8a5b0c04e639ff8a18d7f17ed1c9e'


    ## 1.6 BIS - Crear Addresses (Docker)
    docker exec eth2 geth --datadir nodo1 account new --password /nodo1/pwd.txt 
    https://geth.ethereum.org/docs/rpc/ns-personal#personal_unlockaccount
    docker exec eth2 geth attach


## 1.7 - Geth Init Node (Docker) as Miner
docker run --network br0 -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x92625351eec7342813ced5251beebd0bd4caca70' --password /pwd.txt --graphql --mine --miner.threads=2 --bootnodes 'enode://d36c152e9c39615403909846f499e94d28cb9752057f49483c64065d757e27e1db71828533e82ccfe4c1feacd120d5c2ad194e380f1a4d7e4c0e304642fcb939@127.0.0.1:0?discport=30301'

docker run --network br0 -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x92625351eec7342813ced5251beebd0bd4caca70' --password /pwd.txt --graphql --mine --miner.threads=2 --bootnodes 'enode://d36c152e9c39615403909846f499e94d28cb9752057f49483c64065d757e27e1db71828533e82ccfe4c1feacd120d5c2ad194e380f1a4d7e4c0e304642fcb939@ethereum-bootnode:0?discport=30301'

## 1.7.1 
docker run -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0xa1acd1cacab4e8eb12f8bbe11e6b4ae6d3d8937c' --password /pwd.txt --graphql --mine --miner.threads=2 --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'

docker run --network br0 -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0xa1acd1cacab4e8eb12f8bbe11e6b4ae6d3d8937c' --password /pwd.txt --graphql --mine --miner.threads=2 --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'


## 1.7 BIS Node 2
docker run --network br0 -p 8546:8546 -p 30304:30304 -v $(pwd)/nodo2:/nodo2 -v $(pwd)/pwd.txt:/pwd.txt --name eth3 ethereum/client-go --port 30304 --authrpc.port 8552 --http.port 8546 --datadir nodo2 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8546 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x204ab07e0851b4570b66c96704afa5a4d1ab100a' --password /pwd.txt --graphql --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'

docker run -p 8547:8547 -p 30305:30305 -v $(pwd)/nodo3:/nodo3 -v $(pwd)/pwd.txt:/pwd.txt --name eth4 ethereum/client-go --port 30305 --authrpc.port 8553 --http.port 8547 --datadir nodo3 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8547 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x77b5168A7EE06d1406CBEC99C5c70085a92D8c71' --password /pwd.txt --graphql --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'



%%%%%%%%%%%docker run -d -p 8546:8545 -p 30304:30303 -v $(pwd)/nodo1:/nodo1 --name eth2 ethereum/client-go --datadir nodo1 --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --allow-insecure-unlock --graphql --bootnodes 'enode://fa27e7e91856d24c3486f6ef853bacd1be88fbd51480cb7a0abdbd73090e577f8c6bdeec9ed2fab679ee8808e47e8f0254cc56e9ee451424dae519beafbbf858@127.0.0.1:0?discport=30301'




# OTROS LINKS
https://ethereum.stackexchange.com/questions/2226/how-to-backup-account-information-from-geth-in-a-docker-container
https://github.com/0x0I/container-file-geth
https://gist.github.com/0x0I/5887dae3cdf4620ca670e3b194d82cba
https://www.digitalocean.com/community/tutorials/how-to-use-docker-exec-to-run-commands-in-a-docker-container
https://ethereum.stackexchange.com/questions/99257/how-to-access-ethereum-client-go-shell-outside-docker-container
https://www.polarsparc.com/xhtml/PrivateEthDocker.html
https://ethereum.stackexchange.com/questions/53086/go-ethereum-get-the-enode-before-starting-geth
https://medium.com/@pradeep_thomas/how-to-setup-your-own-private-ethereum-network-part-2-3b72dbae3fba
https://zouhirtaousy.medium.com/build-ethereum-private-network-in-production-with-docker-without-bootnode-d80ff2a280f6
https://medium.com/@javahippie/building-a-local-ethereum-network-with-docker-and-geth-5b9326b85f37
https://medium.com/scb-digital/running-a-private-ethereum-blockchain-using-docker-589c8e6a4fe8 



# EXECUTE DOCKER SHELL 
docker exec -it eth2 /bin/sh
//need to locate geth.ipc to launch console
ls
cd nodo1
ls
geth attach geth.ipc
admin.nodeInfo

//To find stuff
find / -name "account"


# GETH COMMANDS V DOCKER COMMANDS (DIAPOS)
## Create Account 
### GETH
geth --datadir nodo1 account new --password ./pwd.txt
### DOCKER
docker run -d ethereum/client-go geth --datadir nodo1 account new --password ./pwd.txt
docker exec eth-node-02 geth --datadir nodo1 account new --password /nodo1/pwd.txt

## Init node DB
### GETH
geth init --datadir nodo1 ./curso.json
### DOCKER (se puede quitar los puertos)
docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/curso.json:/curso.json -v $(pwd)/curso.json:/curso.json --name eth1 ethereum/client-go init --datadir nodo1 /curso.json 

## Init node
### GETH
geth --datadir nodo1 --syncmode full --http --http.api admin,eth,miner,net,txpool,personal --http.port 8545 --allow-insecure-unlock --unlock '0x4756f6556396add3ff30e9c35bb0e5e4d21c1cf3' --password pwd.txt --bootnodes 'enode://3911b1c4ba036e44119f959fca3ddceee0b2e7ec326e97d77a1870ddfc50019653e0789a209272772de3e35de7fbd27ee1e0553954fac911858491c85abae71e@127.0.0.1:0?discport=30301'
### DOCKER (se puede quitar los puertos)
docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/data:/data --name eth-node-01 ethereum/client-go --datadir data --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --mine --miner.etherbase 0xff21E724B7D483fc93708855AbE6ee4f1eD97BF3 --miner.threads=1


## Boot Node
### GETH
bootnode --genkey=boot-key
bootnode --verbosity=9 --nodekey=boot-key
### DOCKER (se puede quitar los puertos)
docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key
docker run -d --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=3







## PRUEBAS OWN HOSTED NETWORK

### br0

docker network create \
  --driver=bridge \
  --subnet=172.28.0.0/16 \
  --ip-range=172.28.5.0/24 \
  --gateway=172.28.5.254 \
  br0

docker run --network br0 -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/pwd.txt:/pwd.txt --name eth2 ethereum/client-go --datadir nodo1 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0xFE026Fa145c5bC3208CAfa7D9e44a37E1250947c' --password /pwd.txt --graphql --mine --miner.threads=2 

docker run --network br0 -p 8546:8546 -p 30304:30304 -v $(pwd)/nodo2:/nodo2 -v $(pwd)/pwd.txt:/pwd.txt --name eth3 ethereum/client-go --port 30304 --authrpc.port 8552 --http.port 8546 --datadir nodo2 --nodiscover --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8546 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x8342E3D12a47D53e45af4bA600CEDCB5DE793454' --password /pwd.txt --graphql --mine --miner.threads=2 


### network host 

172.17.0.3

docker run --network host -p 8546:8546 -p 30304:30304 -v $(pwd)/nodo2:/nodo2 -v $(pwd)/pwd.txt:/pwd.txt --name eth3 ethereum/client-go --port 30304 --authrpc.port 8552 --http.port 8546 --datadir nodo2 --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8546 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x643E40573e5dCe3489ffC7A26759442dffaC9694' --password /pwd.txt --graphql --bootnodes 'enode://48b4515deeb86d88aef15eb29cc86f94ed01de7a9f9b3002c2c1e094a404aff006d5b9d844206da5031c2e4dcd07473168f6cee1a3a37a70940a4c59d52d0adb@127.0.0.1:0?discport=30301'

enode://b5279d2fc22094a2b33e1161473da571046cd0359e8191b21d5e4526c4fb401419e17928cab26ee82aa1d616ee0f6d4fb130fe8b7ce4227dac205e376c62b1f1@127.0.0.1:30304


docker run --network host -p 8547:8547 -p 30305:30305 -v $(pwd)/nodo3:/nodo3 -v $(pwd)/pwd.txt:/pwd.txt --name eth4 ethereum/client-go --port 30305 --authrpc.port 8553 --http.port 8547 --datadir nodo3 --syncmode full --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --http.corsdomain '*' --allow-insecure-unlock --unlock '0x77b5168A7EE06d1406CBEC99C5c70085a92D8c71' --password /pwd.txt --graphql --bootnodes 'enode://9783bb6601270382075a77954f97dcc15d67cd5c0e4ff2ffadb1aad49f3b7a74394332e4fc1551e356360a481cbc7cd3ec57b5cb5ee0e7e2fe9aa355b9a0b276@127.0.0.1:0?discport=30301'

admin.addPeer("enode://f28beaf44d1eeab3e51f41d2b71fdf989c6e20a1e9bcfa57eb0845acc1552594b29c7f5b94b89b3ffc5acd1ab44e2711660d98b8e9dd2039c83a9e86dd48f41d@localhost:30304")
admin.addPeer("enode://b5279d2fc22094a2b33e1161473da571046cd0359e8191b21d5e4526c4fb401419e17928cab26ee82aa1d616ee0f6d4fb130fe8b7ce4227dac205e376c62b1f1@127.0.0.1:30304")
admin.addPeer("enode://0a7c421e9af3e542857efc351b44561114774bc206bf6033fb446675aab15e43c3504289730ff111b68b6d2fbbfefbc24d796d0f1086a076a88593d279813631@127.0.0.1:30305")

enode://0a7c421e9af3e542857efc351b44561114774bc206bf6033fb446675aab15e43c3504289730ff111b68b6d2fbbfefbc24d796d0f1086a076a88593d279813631@127.0.0.1:30305

docker run --network br0 -p 30301:30301 --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=9 --addr 0.0.0.0:30301


### GETH ###

geth --datadir nodo1 --syncmode full --http --http.api admin,eth,miner,net,txpool,personal --http.port 8545 --allow-insecure-unlock --unlock '0xFE026Fa145c5bC3208CAfa7D9e44a37E1250947c' --password pwd.txt --mine --miner.threads=2 


geth --port 30304 --authrpc.port 8552 --datadir nodo2 --syncmode full --http --http.api admin,eth,miner,net,txpool,personal --http.port 8546 --allow-insecure-unlock --unlock '0x8342E3D12a47D53e45af4bA600CEDCB5DE793454' --password pwd.txt 


geth --port 30305 --authrpc.port 8553 --datadir nodo3 --syncmode full --http --http.api admin,eth,miner,net,txpool,personal --http.port 8547 --allow-insecure-unlock --unlock '0x72571047B4EC9346d7E023cd05C9AD24175065dc' --password pwd.txt --mine --miner.threads=2 