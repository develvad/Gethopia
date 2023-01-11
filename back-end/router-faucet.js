const ex = require('express')
const router = ex.Router();
module.exports = router
const Web3 = require('Web3')
require("dotenv").config() //Toma el fichero .env y crea variables accesibles por process.env.nombre_var
const cors = require('cors')

router.use(cors())

// const URL_NODO = "http://localhost:8566"
// const web3 = new Web3(URL_NODO)

// const URL_NODO = "http://localhost:8566"
// const web3 = new Web3(URL_NODO)

const web3 = new Web3("http://localhost:8545")
// const web3 = new Web3("https://mainnet.infura.io/v3/20b55e65c65649c686d7abc8e4853f0b")

// router.get("/saldo/:cuenta", async (req, res) =>{
router.get("/:redActiva/saldo/:cuenta", async (req, res) =>{
    const HTTP_PORT = 8545 + 1 + (req.params.redActiva * 20)
    const URL_NODO = "http://localhost:" + HTTP_PORT
    // web3 = new Web3(URL_NODO)
    const saldo = await web3.eth.getBalance(req.params.cuenta)
    // res.send({ saldo })
    const saldoEthers = web3.utils.fromWei(saldo, 'ether')
    res.send({ saldoEthers })
})

// router.get("/enviar/:cuenta", async (req, res) =>{
router.get("/:redActiva/enviar/:cuenta", async (req, res) =>{
    const HTTP_PORT = 8545 + 1 + (req.params.redActiva * 20)
    const URL_NODO = "http://localhost:" + HTTP_PORT
    // web3 = new Web3(URL_NODO)
    //Crear y firmar tx de ETH
    const tx = await web3.eth.accounts.signTransaction({
        to: req.params.cuenta,
        from: '0x' + process.env.ADDRESS,
        value: 10E18, //10 ETH en GWEI
        gas: 2000000 //en GWEI
    }, '0x' + process.env.PRIVATE_KEY)
    //Enviar la tx al proveedor (http://localhost:8545)
    const txSended = await web3.eth.sendSignedTransaction(
        tx.rawTransaction
        )
    //Enviar el nuevo saldo
    const saldo = await web3.eth.getBalance(req.params.cuenta)
    res.send({ saldoActualizado:saldo })
})

// const web3 = new Web3("http://localhost:8545")
// // const web3 = new Web3("https://mainnet.infura.io/v3/20b55e65c65649c686d7abc8e4853f0b")

// router.get("/saldo/:cuenta", async (req, res) =>{
//     const saldo = await web3.eth.getBalance(req.params.cuenta)
//     // res.send({ saldo })
//     const saldoEthers = web3.utils.fromWei(saldo, 'ether')
//     res.send({ saldoEthers })
// })

// router.get("/enviar/:cuenta", async (req, res) =>{
//     //Crear y firmar tx de ETH
//     const tx = await web3.eth.accounts.signTransaction({
//         to: req.params.cuenta,
//         from: process.env.ADDRESS,
//         value: 10E18, //10 ETH en GWEI
//         gas: 2000000 //en GWEI
//     }, '0x' + process.env.PRIVATE_KEY)
//     //Enviar la tx al proveedor (http://localhost:8545)
//     const txSended = await web3.eth.sendSignedTransaction(
//         tx.rawTransaction
//         )
//     //Enviar el nuevo saldo
//     const saldo = await web3.eth.getBalance(req.params.cuenta)
//     res.send({ saldoActualizado:saldo })
// })