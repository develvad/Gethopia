const express = require("express");
const { Docker } = require('node-docker-api');
const bodyParser = require('body-parser');
const path = require('node:path');
const fs = require('node:fs');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express();
app.use(bodyParser.json())

app.get('/getAccountOfNode/:folder', async (req, res) => {
    await fs.readdir(path.join(__dirname) + '/' + req.params.folder +  '/keystore', (err, files) => {
        console.log(files[0]);
        const data = fs.readFileSync(path.join(__dirname) + '/' + req.params.folder + '/keystore/'  + files[0], 'utf8');
        const { address } = JSON.parse(data);
        const extraData = `0x${'0'.repeat(64)}${address}${'0'.repeat(130)}`;
        res.status(200).send({address, extraData});
    });
});

app.get('/listAll', (req, res) => {
    docker.container.list()
        .then((containers) => {
          const mapeado = containers.map((e)=> {
              return {
                  id: e.id,
                  names: e.Names
              }
          });
            res.send(mapeado);
        }).catch((e) => res.send({res: e.message}))
});

app.get('/generateGenesis/:name', (req, res) => {
//    const staticName = 'Genesis_' + req.params.name;
    const staticNodeName = 'nodo_' + req.params.name;
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'GENESIS_' + staticNodeName,
        Cmd: ['geth', 'init', '--datadir', staticNodeName, 'genesis.json'],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) + "/" + staticNodeName,
                Destination: "/" + staticNodeName,
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
            {
                Type: "bind",
                Source: path.join(__dirname) +"/genesis.json",
                Destination: "/genesis.json",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            }],
        HostConfig: {
            Binds: [
                path.join(__dirname) + "/"+staticNodeName+":/" + staticNodeName,
                path.join(__dirname) + "/genesis.json:/genesis.json"
            ],
        },
    }) .then( async (container) => {
        await container.start();
        const genesisData = {
            id: container.Id,
            name: staticNodeName
        }
        console.log('Genesis generado: ', genesisData);
        res.send('Creado');
    });
});

app.get('/generateAccount/:name/', (req, res) => {
    const staticNodeName = 'nodo_' + req.params.name;
    const dataToReturn = {};
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'GEN_ACC_' + staticNodeName,
        Cmd: ['geth', '--datadir', staticNodeName, 'account', 'new', '--password', 'masterpassword'],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) + staticNodeName,
                Destination: "/" + staticNodeName,
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
            {
                Type: "bind",
                Source: path.join(__dirname) +"/masterpassword",
                Destination: "/masterpassword",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            }
        ],
        HostConfig: {
            Binds: [
                path.join(__dirname) + '/' + staticNodeName+":/" + staticNodeName,
                path.join(__dirname) + '/masterpassword:/masterpassword',
            ]
        }
    })
        .then(container => container.start())
        .then(() => res.send('Creado'))
});

const createBootKey = async () => {
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'bootnode-gen-key',
        Cmd: ['bootnode', '--genkey=boot-key'],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) +"/boot-key",
                Destination: "/boot-key",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            }
        ],
        HostConfig: {
            Binds: [
                path.join(__dirname) + '/boot-key:/boot-key'
            ]
        }
    }).then(container => container.start())
};

const createBootNode = async () => {
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'bootnode',
        Cmd: ['bootnode', '--nodekey', 'boot-key'],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) +"/boot-key",
                Destination: "/boot-key",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            }
        ],
        Ports: [
            {
                PrivatePort: 30303,
                PublicPort: 30303,
                Type: "tcp"
            },
            {
                PrivatePort: 30303,
                PublicPort: 30303,
                Type: "udp"
            }
        ],
        HostConfig: {
            PortBindings: {
                '30303/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '30303'
                    },
                ],
                '30303/udp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '30303'
                    }
                ],
            },
            Binds: [
                path.join(__dirname) + '/boot-key:/boot-key'
            ],
            NetworkMode: "gethopia"
        }
    })
        .then(container => container.start())
        .then(container => container.logs({
            follow: true,
            stdout: true,
        }))
        .then(stream => {
            stream.on('data', async (info) => {
                const line = info.toString('utf-8').slice(8);
                console.log('bootnode: ' + line);
                const enodetmp = line.split('enode').pop().split('30301')[0];
                const enode = 'enode' + enodetmp + '30301';
                await fs.writeFile('bootnode-enode', enode, (err) => {
                    if(err) {
                        console.error('Error escribiendo el bootnode-enode')
                    }
                });
                console.log('ENODE:: ', enode);
            });
        })
}

app.get('/generateBootNode', async (req, res) => {
    await createBootKey();
    setTimeout(async () => {
        await createBootNode();
    },1000);
    res.send('Bootnode');
});

app.get('/generateBCNode/:name', (req, res) => {
    const enodeFromFile = fs.readFileSync(path.join(__dirname) + '/bootnode-enode','utf8',);
    const folderNode = 'nodo_' + req.params.name;
    docker.container.create({
        Image: 'ethereum/client-go:alltools-v1.10.26',
        name: 'gethopia-node-' + folderNode,
        Cmd: [
            'geth',
            '--datadir',
            folderNode,
            '--syncmode',
            'full',
            '--http',
            '--http.api',
            'admin,eth,miner,net,txpool,personal',
            '--http.port',
            '8545', // TODO: variable
            '--http.corsdomain',
            "'*'",
            '--allow-insecure-unlock',
            '-unlock',
            'bfca22c255c2ea3c28e96a33a673266e4bb6da4b', ///////////// TODO: Sacar de archivo. ( address 0x)
            '--password',
            'masterpassword',
            '--port',
            '30034', // TODO: variable
            '--authrpc.port',
            '8551', // TODO: variable
            '--bootnodes',
            enodeFromFile,
            '--mine',
            '--miner.etherbase',
            'bfca22c255c2ea3c28e96a33a673266e4bb6da4b', ///////////// TODO: Sacar de archivo. ( address 0x)
            '--miner.threads=2'
        ],
        Ports: [
            {
                PrivatePort: 30303,
                PublicPort: 30303,
                Type: "tcp"
            },
            {
                PrivatePort: 30303,
                PublicPort: 30303,
                Type: "udp"
            },
            {
                PrivatePort: 8545,
                PublicPort: 8545,
                Type: "tcp"
            },
            {
                PrivatePort: 8546,
                PublicPort: 8546,
                Type: "tcp"
            }
        ],
        Mounts: [
            {
                Type: "bind",
                Source: path.join(__dirname) + "/" + folderNode,
                Destination: "/" + folderNode,
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
            {
                Type: "bind",
                Source: path.join(__dirname) +"/masterpassword",
                Destination: "/masterpassword",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
            {
                Type: "bind",
                Source: path.join(__dirname) + "/genesis.json",
                Destination: "/genesis.json",
                Mode: "",
                RW: true,
                Propagation: "rprivate"
            },
        ],
        HostConfig: {
            Binds: [
                path.join(__dirname) + '/' + folderNode + ':/' + folderNode,
                path.join(__dirname) + '/masterpassword:/masterpassword',
                path.join(__dirname) + "/genesis.json:/genesis.json"


            ],
            PortBindings: {
                '30303/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '30303'
                    },
                ],
                '30303/udp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '30303'
                    }
                ],
                '8545/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '8545'
                    }
                ],
                '8546/tcp': [
                    {
                        HostIp: '0.0.0.0',
                        HostPort: '8546'
                    }
                ],
            },
            NetworkMode: "gethopia"
        }
    }).then((container) => container.start());

    res.send(enodeFromFile);
});

app.get('/getExtraData', (req, res) => {

});

app.listen(3000);

// curl http://127.0.0.1:3000/generateBootNode
// curl http://127.0.0.1:3000/generateAccount/nodo1
// curl http://127.0.0.1:3000/getAccountOfNode/nodo_nodo1
// curl http://127.0.0.1:3000/generateGenesis/nodo1
// curl http://127.0.0.1:3000/generateBCNode/nodo1

/*
Image: 'ethereum/client-go:alltools-v1.10.26',
Ports: [
    {
        PrivatePort: 30303,
        PublicPort: 30303,
        Type: "tcp"
    },
    {
        PrivatePort: 30303,
        PublicPort: 30303,
        Type: "udp"
    },
    {
        PrivatePort: 8545,
        PublicPort: 8545,
        Type: "tcp"
    },
    {
        PrivatePort: 8546,
        PublicPort: 8546,
        Type: "tcp"
    }
]
ExposedPorts: {
    "30303/tcp": {},
    "30303/udp":{},
    "8545/tcp":{},
    "8546/tcp":{}
},*/

/*"Mounts": [
    {
        "Target": "/",
        "Source":   "genesis.json",
        "Destination": "genesis.json",
        "Type":     "volume",
        "RW": true
    }
],*/

