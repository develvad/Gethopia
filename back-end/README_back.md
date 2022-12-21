############################### REPO REFERENCIA ###############################
https://github.com/vertigobr/ethereum

############################### FLUJO PRINCIPAL SECUENCIA ##############################
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

############################### QUICK ACCESS DOCKER COMMANDS ##############################

## 1.1 - Remove Existing Node
docker stop node
docker remove node

## 1.3 - Create Bootnode
docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key
docker run -d --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=3
docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1

## 1.5 - Init Node DB (Docker) (Con una alternativa para lectura facil)
docker run -d --rm -v $(pwd)/nodo1:/nodo1 -v $(pwd)/curso.json:/curso.json -v $(pwd)/curso.json:/curso.json  --name hello ethereum/client-go init --datadir nodo1 /curso.json

docker run -d --rm \
-v $(pwd)/nodo1:/root/.ethereum \
-v $(pwd)/genesis.json:/opt/genesis.json \
ethereum/client-go init /opt/genesis.json 

## 1.6 - Geth Init Node (Docker) (First should be miner so need to adapt to include --mine --miner.etherbase ADDRESS --miner.threads=1)
docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 --name eth2 ethereum/client-go --datadir nodo1 --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --allow-insecure-unlock --graphql --bootnodes 'enode://fa27e7e91856d24c3486f6ef853bacd1be88fbd51480cb7a0abdbd73090e577f8c6bdeec9ed2fab679ee8808e47e8f0254cc56e9ee451424dae519beafbbf858@127.0.0.1:0?discport=30301'

## 1.7 - Crear Addresses (Docker)
docker exec eth2 geth --datadir nodo1 account new --password /nodo1/pwd.txt 

## 1.8 - Crear Addresses (Docker)
https://geth.ethereum.org/docs/rpc/ns-personal#personal_unlockaccount
docker exec eth2 geth attach


############################### OTROS LINKS ##############################
https://ethereum.stackexchange.com/questions/2226/how-to-backup-account-information-from-geth-in-a-docker-container
https://github.com/0x0I/container-file-geth
https://gist.github.com/0x0I/5887dae3cdf4620ca670e3b194d82cba
https://www.digitalocean.com/community/tutorials/how-to-use-docker-exec-to-run-commands-in-a-docker-container
https://ethereum.stackexchange.com/questions/99257/how-to-access-ethereum-client-go-shell-outside-docker-container

############################### EXECUTE DOCKER SHELL ##############################
docker exec -it eth2 /bin/sh
//need to locate geth.ipc to launch console
ls
cd nodo1
ls
geth attach geth.ipc
admin.nodeInfo

//To find stuff
find / -name "account"


############################### GETH COMMANDS V DOCKER COMMANDS ##############################
## Create Account 
# GETH
geth --datadir nodo1 account new --password ./pwd.txt
# DOCKER
docker run -d ethereum/client-go geth --datadir nodo1 account new --password ./pwd.txt
docker exec eth-node-02 geth --datadir nodo1 account new --password /nodo1/pwd.txt

## Init node DB
# GETH
geth init --datadir nodo1 ./curso.json
# DOCKER (se puede quitar los puertos)
docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/nodo1:/nodo1 -v $(pwd)/curso.json:/curso.json -v $(pwd)/curso.json:/curso.json --name eth1 ethereum/client-go init --datadir nodo1 /curso.json 

## Init node
# GETH
geth --datadir nodo1 --syncmode full --http --http.api admin,eth,miner,net,txpool,personal --http.port 8545 --allow-insecure-unlock --unlock '0x4756f6556396add3ff30e9c35bb0e5e4d21c1cf3' --password pwd.txt --bootnodes 'enode://3911b1c4ba036e44119f959fca3ddceee0b2e7ec326e97d77a1870ddfc50019653e0789a209272772de3e35de7fbd27ee1e0553954fac911858491c85abae71e@127.0.0.1:0?discport=30301'
# DOCKER (se puede quitar los puertos)
docker run -d -p 8545:8545 -p 30303:30303 -v $(pwd)/data:/data --name eth-node-01 ethereum/client-go --datadir data --http.api personal,eth,net,web3 --http --http.addr 0.0.0.0 -http.port 8545 --mine --miner.etherbase 0xff21E724B7D483fc93708855AbE6ee4f1eD97BF3 --miner.threads=1


## Boot Node
# GETH
bootnode --genkey=boot-key
bootnode --verbosity=9 --nodekey=boot-key
# DOCKER (se puede quitar los puertos)
docker run --rm -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --genkey /opt/bootnode/boot.key
docker run -d --name ethereum-bootnode -v $(pwd)/.bootnode:/opt/bootnode ethereum/client-go:alltools-latest bootnode --nodekey /opt/bootnode/boot.key --verbosity=3